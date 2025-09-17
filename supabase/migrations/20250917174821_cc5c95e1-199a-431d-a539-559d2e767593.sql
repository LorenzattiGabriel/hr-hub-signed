-- Update the vacation calculation function to follow Argentine law correctly
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  meses_trabajados INTEGER;
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
BEGIN
  -- Calcular meses trabajados desde ingreso hasta 31 de diciembre
  meses_trabajados := EXTRACT(MONTH FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, calcular basado en meses trabajados
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Si tiene menos de 6 meses, calcular vacaciones proporcionales
    IF meses_trabajados < 6 THEN
      -- Calcular días trabajados desde ingreso hasta 31 de diciembre
      dias_trabajados := fecha_corte - fecha_ingreso + 1;
      -- 1 día de vacaciones cada 20 días trabajados (proporcional)
      RETURN GREATEST(FLOOR(dias_trabajados / 20.0), 0);
    ELSE
      -- Si tiene 6 meses o más en el año, le corresponden 14 días
      RETURN 14;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios < 5 THEN RETURN 14;
    WHEN antiguedad_anios < 10 THEN RETURN 21;
    WHEN antiguedad_anios < 20 THEN RETURN 28;
    ELSE RETURN 35;
  END CASE;
END;
$function$