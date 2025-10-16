-- Actualizar el check constraint de payroll para permitir 'bonus' en lugar de 'commission'
-- Esto soluciona el error al intentar cargar bonificaciones

ALTER TABLE public.payroll DROP CONSTRAINT IF EXISTS payroll_type_check;

ALTER TABLE public.payroll 
ADD CONSTRAINT payroll_type_check 
CHECK (type::text = ANY (ARRAY['salary'::character varying, 'advance'::character varying, 'bonus'::character varying, 'deduction'::character varying]::text[]));