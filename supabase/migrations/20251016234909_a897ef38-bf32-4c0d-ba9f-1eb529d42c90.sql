-- Reset dias_usados to 0 for specific employees (Lucas Milton and Laura Roxana)
UPDATE public.vacation_balances vb
SET dias_usados = 0
FROM public.employees e
WHERE vb.employee_id = e.id
  AND e.dni IN ('38020563','25089374');

-- Ensure no leftover vacation requests for these employees (cleanup, harmless if none exist)
DELETE FROM public.vacation_requests vr
USING public.employees e
WHERE vr.employee_id = e.id
  AND e.dni IN ('38020563','25089374');