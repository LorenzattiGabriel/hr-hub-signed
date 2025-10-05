-- Actualizar valores existentes de 'commission' a 'bonus' en la tabla payroll
UPDATE public.payroll 
SET type = 'bonus' 
WHERE type = 'commission';

-- Nota: Como el campo 'type' es de tipo varchar sin restricciones CHECK específicas,
-- no necesitamos modificar restricciones adicionales. 
-- Los nuevos valores 'bonus' se pueden insertar directamente.