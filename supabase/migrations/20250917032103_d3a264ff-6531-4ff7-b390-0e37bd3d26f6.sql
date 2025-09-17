-- Fix function search path for calculate_vacation_days
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso DATE)
RETURNS INTEGER AS $$
DECLARE
  antiguedad_anios INTEGER;
BEGIN
  antiguedad_anios := EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_ingreso));
  
  CASE 
    WHEN antiguedad_anios < 1 THEN RETURN 0;
    WHEN antiguedad_anios < 5 THEN RETURN 14;
    WHEN antiguedad_anios < 10 THEN RETURN 21;
    WHEN antiguedad_anios < 20 THEN RETURN 28;
    ELSE RETURN 35;
  END CASE;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix function search path for get_total_available_days  
CREATE OR REPLACE FUNCTION public.get_total_available_days(employee_id UUID, year INTEGER)
RETURNS INTEGER AS $$
DECLARE
  balance_record public.vacation_balances%ROWTYPE;
  total_available INTEGER;
BEGIN
  SELECT * INTO balance_record 
  FROM public.vacation_balances 
  WHERE vacation_balances.employee_id = get_total_available_days.employee_id 
    AND vacation_balances.year = get_total_available_days.year;
  
  IF balance_record IS NULL THEN
    RETURN 0;
  END IF;
  
  total_available := balance_record.dias_totales + balance_record.dias_adeudados - balance_record.dias_usados;
  RETURN GREATEST(total_available, 0);
END;
$$ LANGUAGE plpgsql SET search_path = public;