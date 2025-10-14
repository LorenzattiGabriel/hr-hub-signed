-- Migración para soportar días decimales en vacaciones (ej: 0.5 para medio día)
-- Cambiar columnas de INTEGER a NUMERIC(5,2) para permitir hasta 999.99 días

-- Actualizar tabla vacation_balances
ALTER TABLE public.vacation_balances 
  ALTER COLUMN dias_totales TYPE NUMERIC(5,2),
  ALTER COLUMN dias_adeudados TYPE NUMERIC(5,2), 
  ALTER COLUMN dias_usados TYPE NUMERIC(5,2);

-- Actualizar tabla vacation_requests
ALTER TABLE public.vacation_requests 
  ALTER COLUMN dias_solicitados TYPE NUMERIC(5,2);

-- Primero eliminar la función existente
DROP FUNCTION IF EXISTS public.get_total_available_days(uuid, integer);

-- Recrear función get_total_available_days para retornar NUMERIC
CREATE OR REPLACE FUNCTION public.get_total_available_days(employee_id UUID, year INTEGER)
RETURNS NUMERIC(5,2) AS $$
DECLARE
  balance_record public.vacation_balances%ROWTYPE;
  total_available NUMERIC(5,2);
BEGIN
  SELECT * INTO balance_record 
  FROM public.vacation_balances 
  WHERE vacation_balances.employee_id = get_total_available_days.employee_id 
    AND vacation_balances.year = get_total_available_days.year;
  
  IF balance_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Solo días totales - días usados (ya no incluimos adeudados)
  total_available := balance_record.dias_totales - balance_record.dias_usados;
  RETURN GREATEST(total_available, 0);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Comentario para referencia
COMMENT ON TABLE public.vacation_balances IS 'Tabla de balances de vacaciones - soporta días decimales (ej: 0.5 para medio día)';
COMMENT ON TABLE public.vacation_requests IS 'Tabla de solicitudes de vacaciones - soporta días decimales (ej: 0.5 para medio día)';
