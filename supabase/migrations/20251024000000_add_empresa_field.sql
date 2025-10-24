-- Agregar columna 'empresa' a la tabla employees
-- Esta columna permite identificar a qué empresa pertenece cada empleado (Vematel o Servicap)

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS empresa TEXT;

-- Agregar un comentario a la columna para documentación
COMMENT ON COLUMN employees.empresa IS 'Empresa a la que pertenece el empleado: vematel o servicap';

-- Crear un índice para mejorar las consultas por empresa
CREATE INDEX IF NOT EXISTS idx_employees_empresa ON employees(empresa);

