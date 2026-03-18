import { z } from "zod";

export const vipClientSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  apellido: z.string().min(1, "El apellido es obligatorio."),
  email: z.string().email("El email no es válido."),
  empresa: z.string().min(1, "La empresa es obligatoria."),
  cargo: z.string().min(1, "El cargo es obligatorio."),
  telefono: z.string().min(1, "El teléfono es obligatorio."),
});

export type VipClientFormValues = z.infer<typeof vipClientSchema>;
