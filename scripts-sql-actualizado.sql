-- Eliminar tabla antigua y crear la nueva estructura
DROP TABLE IF EXISTS inventario_equipos CASCADE;

-- Crear tabla con estructura mejorada
CREATE TABLE inventario_equipos (
  id BIGSERIAL PRIMARY KEY,
  item_number SERIAL UNIQUE,
  tipo_equipo VARCHAR(50) NOT NULL, -- DESKTOP, IMPRESORA, SCANNER
  
  -- Campos comunes a todos
  codigo_patrimonial VARCHAR(100),
  serie VARCHAR(100),
  marca VARCHAR(100),
  modelo VARCHAR(100),
  estado VARCHAR(20), -- OPERATIVO, INOPERATIVO
  
  -- Campos específicos para DESKTOP
  so_cpu VARCHAR(100),
  procesador_cpu VARCHAR(100),
  ip_cpu VARCHAR(20),
  ofimatica_cpu VARCHAR(100),
  codigo_patrimonial_teclado VARCHAR(100),
  serie_teclado VARCHAR(100),
  marca_teclado VARCHAR(100),
  modelo_teclado VARCHAR(100),
  estado_teclado VARCHAR(20),
  codigo_patrimonial_monitor VARCHAR(100),
  serie_monitor VARCHAR(100),
  marca_monitor VARCHAR(100),
  modelo_monitor VARCHAR(100),
  estado_monitor VARCHAR(20),
  
  -- Campos de ubicación (comunes)
  red_asistencial VARCHAR(100), -- PRESTACIONAL, SEDE CENTRAL, etc.
  gerencia VARCHAR(100), -- GERENCIA CENTRAL, CENTRO ASISTENCIAL, etc.
  sub_gerencia VARCHAR(100),
  ubicacion VARCHAR(255),
  piso VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_tipo_equipo ON inventario_equipos(tipo_equipo);
CREATE INDEX idx_estado ON inventario_equipos(estado);

-- RLS Policies
ALTER TABLE inventario_equipos ENABLE ROW LEVEL SECURITY;

-- Policy para SELECT (todos pueden leer)
CREATE POLICY "public_read_inventario" 
  ON inventario_equipos 
  FOR SELECT 
  USING (true);

-- Policy para INSERT (todos pueden crear)
CREATE POLICY "public_create_inventario" 
  ON inventario_equipos 
  FOR INSERT 
  WITH CHECK (true);

-- Policy para UPDATE (todos pueden actualizar)
CREATE POLICY "public_update_inventario" 
  ON inventario_equipos 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

-- Policy para DELETE (solo admin, verificado en app)
CREATE POLICY "admin_delete_inventario" 
  ON inventario_equipos 
  FOR DELETE 
  USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventario_updated_at
BEFORE UPDATE ON inventario_equipos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
