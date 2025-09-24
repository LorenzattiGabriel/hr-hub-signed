-- Corregir cálculo de vacaciones para empleados con menos de 6 meses
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
RETURNS integer
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
  meses_trabajados NUMERIC;
BEGIN
  -- Calcular antigüedad en años completos al 31 de diciembre
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, verificar casos especiales
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Calcular días trabajados desde ingreso hasta 31 de diciembre (días calendario)
    dias_trabajados := fecha_corte - fecha_ingreso + 1;
    
    -- Calcular meses trabajados
    meses_trabajados := EXTRACT(EPOCH FROM AGE(fecha_corte, fecha_ingreso)) / (30.44 * 24 * 60 * 60); -- Promedio días por mes
    
    -- Si trabajó menos de 6 meses: 1 día de vacaciones por cada 20 días de trabajo efectivo
    IF meses_trabajados < 6 THEN
      RETURN FLOOR(dias_trabajados / 20.0);
    ELSE
      -- Si trabajó 6 meses o más en el año, le corresponden 14 días
      RETURN 14;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos (según Ley de Contrato de Trabajo N° 20.744)
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios <= 5 THEN RETURN 14;  -- Hasta 5 años: 14 días corridos
    WHEN antiguedad_anios <= 10 THEN RETURN 21; -- Más de 5 hasta 10 años: 21 días corridos  
    WHEN antiguedad_anios <= 20 THEN RETURN 28; -- Más de 10 hasta 20 años: 28 días corridos
    ELSE RETURN 35; -- Más de 20 años: 35 días corridos
  END CASE;
END;
$function$;