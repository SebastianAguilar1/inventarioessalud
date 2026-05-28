-- ============================================
-- 1. CREAR TABLA DE USUARIOS
-- ============================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'visitante')),
  estado BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CREAR TABLA DE TIPOS DE EQUIPOS
-- ============================================
CREATE TABLE tipos_equipos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. CREAR TABLA DE INVENTARIO DE EQUIPOS
-- ============================================
CREATE TABLE inventario_equipos (
  id SERIAL PRIMARY KEY,
  item INT GENERATED ALWAYS AS IDENTITY,
  
  -- Información general
  tipo_equipo_id INT NOT NULL REFERENCES tipos_equipos(id),
  estado_equipo VARCHAR(20) NOT NULL CHECK (estado_equipo IN ('OPERATIVO', 'INOPERATIVO')),
  
  -- Información de CPU
  codigo_patrimonial_cpu VARCHAR(100),
  serie_cpu VARCHAR(100),
  marca_cpu VARCHAR(100),
  modelo_cpu VARCHAR(100),
  sistema_operativo VARCHAR(100),
  procesador VARCHAR(100),
  ip VARCHAR(20),
  ofimatica VARCHAR(100),
  estado_cpu VARCHAR(20) CHECK (estado_cpu IN ('OPERATIVO', 'INOPERATIVO')),
  
  -- Información de Teclado
  codigo_patrimonial_teclado VARCHAR(100),
  serie_teclado VARCHAR(100),
  marca_teclado VARCHAR(100),
  modelo_teclado VARCHAR(100),
  estado_teclado VARCHAR(20) CHECK (estado_teclado IN ('OPERATIVO', 'INOPERATIVO')),
  
  -- Información de Monitor
  codigo_patrimonial_monitor VARCHAR(100),
  serie_monitor VARCHAR(100),
  marca_monitor VARCHAR(100),
  modelo_monitor VARCHAR(100),
  estado_monitor VARCHAR(20) CHECK (estado_monitor IN ('OPERATIVO', 'INOPERATIVO')),
  
  -- Información de Ubicación
  red_asistencial VARCHAR(100),
  gerencia_central VARCHAR(100),
  sub_gerencia VARCHAR(100),
  ubicacion VARCHAR(255),
  piso VARCHAR(20) CHECK (piso IN ('PISO-1', 'PISO-2', 'PISO-3')),
  
  -- Control de formulario
  completado BOOLEAN DEFAULT false,
  
  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES usuarios(id),
  updated_by UUID REFERENCES usuarios(id)
);

-- ============================================
-- 4. INSERTAR USUARIOS POR DEFECTO
-- ============================================
INSERT INTO usuarios (username, password, rol, estado) VALUES
('admin', 'nh1c4', 'admin', true),
('visitante', 'EssaluDF123', 'visitante', true);

-- ============================================
-- 5. INSERTAR TIPOS DE EQUIPOS POR DEFECTO
-- ============================================
INSERT INTO tipos_equipos (nombre, descripcion) VALUES
('CPU', 'Unidad Central de Procesamiento'),
('Monitor', 'Pantalla de visualización'),
('Teclado', 'Teclado para computadora'),
('Impresora', 'Dispositivo de impresión'),
('Scanner', 'Dispositivo de escaneo'),
('Otro', 'Otros equipos');

-- ============================================
-- 6. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================
CREATE INDEX idx_inventario_tipo_equipo ON inventario_equipos(tipo_equipo_id);
CREATE INDEX idx_inventario_estado ON inventario_equipos(estado_equipo);
CREATE INDEX idx_inventario_created_by ON inventario_equipos(created_by);
CREATE INDEX idx_inventario_ubicacion ON inventario_equipos(ubicacion);
CREATE INDEX idx_usuarios_username ON usuarios(username);

-- ============================================
-- 7. CREAR FUNCIÓN PARA ACTUALIZAR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. CREAR TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE TRIGGER update_usuarios_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_timestamp
BEFORE UPDATE ON inventario_equipos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_equipos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios (solo pueden leer su propio registro)
CREATE POLICY "Usuarios pueden leer su propio registro"
  ON usuarios FOR SELECT
  USING (true);

-- Políticas para tipos_equipos (todos pueden leer)
CREATE POLICY "Todos pueden leer tipos de equipos"
  ON tipos_equipos FOR SELECT
  USING (true);

CREATE POLICY "Solo admin puede insertar tipos de equipos"
  ON tipos_equipos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Solo admin puede actualizar tipos de equipos"
  ON tipos_equipos FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Solo admin puede eliminar tipos de equipos"
  ON tipos_equipos FOR DELETE
  USING (true);

-- Políticas para inventario_equipos
CREATE POLICY "Todos pueden leer inventario"
  ON inventario_equipos FOR SELECT
  USING (true);

CREATE POLICY "Todos pueden crear registros"
  ON inventario_equipos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin puede actualizar todos los registros"
  ON inventario_equipos FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin puede eliminar registros"
  ON inventario_equipos FOR DELETE
  USING (true);
