-- Agregar columna 'fecha_registro' a la tabla employees
-- Esta columna almacena la fecha de registro del empleado (opcional)

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS fecha_registro DATE;

-- Agregar un comentario a la columna para documentación
COMMENT ON COLUMN employees.fecha_registro IS 'Fecha de registro del empleado en el sistema (opcional)';

-- Crear un índice para mejorar las consultas por fecha de registro
CREATE INDEX IF NOT EXISTS idx_employees_fecha_registro ON employees(fecha_registro);

