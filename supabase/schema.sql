-- ============================================
-- RBS Entertainment - Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE estado_publicacion AS ENUM ('borrador', 'vip', 'publicado', 'archivado');
CREATE TYPE user_role AS ENUM ('super_admin', 'admin');

-- ============================================
-- TABLES
-- ============================================

-- Movies
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  sinopsis TEXT,
  poster_url TEXT,
  estado_publicacion estado_publicacion NOT NULL DEFAULT 'borrador',
  fecha_anuncio_preventa TIMESTAMPTZ,
  fecha_preventa TIMESTAMPTZ,
  fecha_pre_estreno TIMESTAMPTZ,
  hora_pre_estreno TIME,
  fecha_estreno TIMESTAMPTZ,
  calificacion TEXT,
  formato_version TEXT,
  duracion_minutos INTEGER,
  genero TEXT,
  anio INTEGER,
  director TEXT,
  distributor TEXT,
  trailer_url TEXT,
  hero_image_url TEXT,
  link_movie TEXT,
  link_life_cinemas TEXT,
  link_grupo_cine TEXT,
  link_cines_del_este TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Movie Documents
CREATE TABLE movie_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- VIP Clients
CREATE TABLE vip_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  empresa TEXT NOT NULL,
  cargo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- User Roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Log (immutable)
CREATE TABLE audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Login Attempts (for lockout)
CREATE TABLE login_attempts (
  email TEXT PRIMARY KEY,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_movies_estado ON movies(estado_publicacion);
CREATE INDEX idx_movies_estreno ON movies(fecha_estreno);
CREATE INDEX idx_movie_documents_movie ON movie_documents(movie_id);
CREATE INDEX idx_vip_clients_email ON vip_clients(email);
CREATE INDEX idx_vip_clients_deleted ON vip_clients(is_deleted);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER vip_clients_updated_at
  BEFORE UPDATE ON vip_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PREVENT AUDIT LOG MODIFICATIONS
-- ============================================

CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries cannot be modified or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update
  BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

CREATE TRIGGER audit_log_no_delete
  BEFORE DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- ============================================
-- LOGIN ATTEMPTS RPC (for lockout check)
-- ============================================

CREATE OR REPLACE FUNCTION check_login_attempt(p_email TEXT)
RETURNS JSON AS $$
DECLARE
  v_record login_attempts%ROWTYPE;
  v_is_locked BOOLEAN := FALSE;
  v_remaining_minutes INTEGER := 0;
BEGIN
  SELECT * INTO v_record FROM login_attempts WHERE email = p_email;

  IF v_record IS NOT NULL AND v_record.locked_until IS NOT NULL AND v_record.locked_until > NOW() THEN
    v_is_locked := TRUE;
    v_remaining_minutes := CEIL(EXTRACT(EPOCH FROM (v_record.locked_until - NOW())) / 60);
    RETURN json_build_object('locked', TRUE, 'remaining_minutes', v_remaining_minutes);
  END IF;

  RETURN json_build_object('locked', FALSE, 'remaining_minutes', 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_login_attempt(p_email TEXT)
RETURNS JSON AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO login_attempts (email, attempt_count, updated_at)
  VALUES (p_email, 1, NOW())
  ON CONFLICT (email) DO UPDATE
  SET attempt_count = CASE
    WHEN login_attempts.locked_until IS NOT NULL AND login_attempts.locked_until > NOW() THEN login_attempts.attempt_count
    WHEN login_attempts.locked_until IS NOT NULL AND login_attempts.locked_until <= NOW() THEN 1
    ELSE login_attempts.attempt_count + 1
  END,
  locked_until = CASE
    WHEN login_attempts.attempt_count >= 4 AND (login_attempts.locked_until IS NULL OR login_attempts.locked_until <= NOW())
    THEN NOW() + INTERVAL '15 minutes'
    ELSE login_attempts.locked_until
  END,
  updated_at = NOW()
  RETURNING attempt_count INTO v_count;

  IF v_count >= 5 THEN
    RETURN json_build_object('locked', TRUE, 'remaining_minutes', 15);
  END IF;

  RETURN json_build_object('locked', FALSE, 'attempts', v_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reset_login_attempts(p_email TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM login_attempts WHERE email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Movies: admins see all, authenticated non-admins see vip+publicado
CREATE POLICY "Movies readable by admins" ON movies
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Movies readable by vip users" ON movies
  FOR SELECT TO authenticated
  USING (
    estado_publicacion IN ('vip', 'publicado')
    AND NOT EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Movies writable by admins" ON movies
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

-- Movies also readable publicly (for landing page)
CREATE POLICY "Published movies readable by public" ON movies
  FOR SELECT TO anon
  USING (estado_publicacion = 'publicado');

-- Movie Documents: only admins can read and write
CREATE POLICY "Documents readable by admins" ON movie_documents
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Documents writable by admins" ON movie_documents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

-- VIP Clients: read/write by admin/super_admin
CREATE POLICY "VIP clients manageable by admins" ON vip_clients
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

-- User Roles: read by authenticated, write by super_admin
CREATE POLICY "Roles readable by authenticated" ON user_roles
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Roles writable by super_admin" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- Audit Log: insert by authenticated, read by super_admin
CREATE POLICY "Audit insertable by authenticated" ON audit_log
  FOR INSERT TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Audit readable by super_admin" ON audit_log
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- Login Attempts: accessible via RPC only (SECURITY DEFINER functions)
CREATE POLICY "Login attempts via RPC only" ON login_attempts
  FOR ALL TO anon, authenticated
  USING (FALSE);

-- ============================================
-- USER PROFILES VIEW (exposes auth.users email for admin lookups)
-- ============================================

CREATE OR REPLACE VIEW user_profiles AS
SELECT id, email
FROM auth.users;

-- Grant access to authenticated users
GRANT SELECT ON user_profiles TO authenticated;

-- ============================================
-- STORAGE BUCKETS
-- (Run these in the Supabase Dashboard > Storage, or via SQL)
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('movie-posters', 'movie-posters', TRUE);
INSERT INTO storage.buckets (id, name, public) VALUES ('movie-documents', 'movie-documents', FALSE);

-- Storage policies: movie-posters (public read, admin write)
CREATE POLICY "Movie posters public read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'movie-posters');

CREATE POLICY "Movie posters admin write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'movie-posters'
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Movie posters admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'movie-posters'
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

-- Storage policies: movie-documents (authenticated read, admin write)
CREATE POLICY "Movie documents authenticated read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'movie-documents');

CREATE POLICY "Movie documents admin write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'movie-documents'
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Movie documents admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'movie-documents'
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
    )
  );
