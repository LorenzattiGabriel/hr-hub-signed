-- Update vacation days calculation function to follow Argentine Labor Law exactly
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
RETURNS integer
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
  dias_habiles_anio INTEGER := 261; -- Aproximadamente 261 días hábiles por año en Argentina
  dias_trabajados_anio INTEGER;
BEGIN
  -- Calcular antigüedad en años completos al 31 de diciembre
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, verificar casos especiales
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Calcular días trabajados desde ingreso hasta 31 de diciembre
    dias_trabajados := fecha_corte - fecha_ingreso + 1;
    
    -- Estimar días hábiles trabajados (asumiendo 5 días hábiles por semana)
    dias_trabajados_anio := ROUND(dias_trabajados * 5.0 / 7.0);
    
    -- Verificar si trabajó menos de 6 meses (aproximadamente 130 días hábiles)
    IF dias_trabajados_anio < 130 THEN
      -- Menos de 6 meses: 1 día de vacaciones por cada 20 días de trabajo efectivo
      RETURN GREATEST(FLOOR(dias_trabajados_anio / 20.0), 0);
    ELSE
      -- Trabajó más de 6 meses: debe haber trabajado al menos la mitad de los días hábiles del año
      -- Si cumple la condición, le corresponden 14 días
      IF dias_trabajados_anio >= (dias_habiles_anio / 2) THEN
        RETURN 14;
      ELSE
        -- No cumple la condición para vacaciones completas
        RETURN FLOOR(dias_trabajados_anio / 20.0);
      END IF;
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