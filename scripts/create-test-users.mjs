import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ibsffdlzvbeiolyfpyoy.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY env var first");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  { email: "admin@rbs-test.com", password: "Admin2026!RBS", role: "super_admin" },
  { email: "vip@rbs-test.com", password: "Vip2026!RBS", role: null },
];

for (const u of users) {
  console.log(`\nCreating ${u.email}...`);

  // Create auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      console.log(`  Already exists, skipping creation.`);
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list.users.find((x) => x.email === u.email);
      if (existing && u.role) {
        const { error: roleErr } = await supabase
          .from("user_roles")
          .upsert({ user_id: existing.id, role: u.role }, { onConflict: "user_id" });
        if (roleErr) console.log(`  Role error: ${roleErr.message}`);
        else console.log(`  Role set to ${u.role}`);
      }
    } else {
      console.error(`  Error: ${error.message}`);
    }
    continue;
  }

  console.log(`  Created with ID: ${data.user.id}`);

  // Assign role if needed
  if (u.role) {
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: u.role });
    if (roleErr) console.error(`  Role error: ${roleErr.message}`);
    else console.log(`  Role set to ${u.role}`);
  }
}

console.log("\n--- Test Credentials ---");
console.log("ADMIN:  admin@rbs-test.com / Admin2026!RBS  (super_admin)");
console.log("VIP:    vip@rbs-test.com   / Vip2026!RBS    (authenticated, no role)");
console.log("------------------------\n");
