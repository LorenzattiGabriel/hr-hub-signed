-- Insert initial vacation balances for the sample employees
INSERT INTO public.vacation_balances (employee_id, year, dias_totales, dias_adeudados, dias_usados)
SELECT 
  e.id,
  2025 as year,
  public.calculate_vacation_days(e.fecha_ingreso) as dias_totales,
  CASE 
    WHEN e.dni = '12345678' THEN 5  -- María has 5 owed days from previous year
    WHEN e.dni = '87654321' THEN 3  -- Juan has 3 owed days
    ELSE 0
  END as dias_adeudados,
  CASE 
    WHEN e.dni = '12345678' THEN 2  -- María has used 2 days
    ELSE 0
  END as dias_usados
FROM public.employees e
WHERE e.dni IN ('12345678', '87654321', '45678912');