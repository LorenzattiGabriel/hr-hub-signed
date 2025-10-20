-- Agregar columna id_huella a la tabla employees
ALTER TABLE public.employees 
ADD COLUMN id_huella character varying(50);