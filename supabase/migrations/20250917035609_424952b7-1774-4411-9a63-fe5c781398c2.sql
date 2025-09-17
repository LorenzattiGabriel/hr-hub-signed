-- Align allowed absence types with UI options
ALTER TABLE public.absences DROP CONSTRAINT IF EXISTS absences_tipo_check;

ALTER TABLE public.absences
ADD CONSTRAINT absences_tipo_check
CHECK (
  tipo IN (
    'enfermedad',
    'personal',
    'familiar',
    'vacaciones',
    'licencia',
    'otro',
    'accidente',
    'maternidad',
    'paternidad',
    'estudio'
  )
);