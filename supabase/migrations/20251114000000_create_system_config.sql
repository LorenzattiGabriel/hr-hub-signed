-- Create system_config table for storing application settings
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (for login verification)
CREATE POLICY "Allow public read access to system_config" 
ON system_config FOR SELECT 
TO public 
USING (true);

-- Create policy to prevent write access from client
CREATE POLICY "Prevent public write access to system_config" 
ON system_config FOR INSERT 
TO public 
WITH CHECK (false);

CREATE POLICY "Prevent public update access to system_config" 
ON system_config FOR UPDATE 
TO public 
USING (false);

CREATE POLICY "Prevent public delete access to system_config" 
ON system_config FOR DELETE 
TO public 
USING (false);

-- Insert initial login password
INSERT INTO system_config (key, value, description)
VALUES ('app_password', 'talenthub2026', 'Contraseña de acceso a la aplicación')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, updated_at = NOW();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_system_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_system_config_updated_at_trigger
BEFORE UPDATE ON system_config
FOR EACH ROW
EXECUTE FUNCTION update_system_config_updated_at();

-- Add comment to table
COMMENT ON TABLE system_config IS 'Tabla de configuración del sistema para almacenar ajustes de la aplicación';
COMMENT ON COLUMN system_config.key IS 'Clave única de configuración';
COMMENT ON COLUMN system_config.value IS 'Valor de la configuración';
COMMENT ON COLUMN system_config.description IS 'Descripción de la configuración';

