-- Fix security warnings by setting search_path for new functions
DROP FUNCTION IF EXISTS public.calculate_next_delivery_date(text, date);
DROP FUNCTION IF EXISTS public.trigger_calculate_next_delivery_date();

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_next_delivery_date(
  uniform_type_param text,
  delivery_date_param date
) RETURNS date 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  CASE uniform_type_param
    WHEN 'Remera', 'Pantalón cargo', 'Campera', 'Buzo' THEN
      -- Uniformes: cada 6 meses
      RETURN delivery_date_param + INTERVAL '6 months';
    WHEN 'Zapatos punta de acero' THEN
      -- Zapatos: cada 1 año
      RETURN delivery_date_param + INTERVAL '1 year';
    ELSE
      -- Elementos de protección (Barbijo, Guantes, Mameluco, Sordina, Gafas de seguridad): cuando se rompen
      RETURN NULL;
  END CASE;
END;
$$;

-- Recreate trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.trigger_calculate_next_delivery_date()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  NEW.next_delivery_date = calculate_next_delivery_date(NEW.uniform_type, NEW.delivery_date);
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS calculate_next_delivery_date_trigger ON public.uniforms;
CREATE TRIGGER calculate_next_delivery_date_trigger
  BEFORE INSERT OR UPDATE ON public.uniforms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calculate_next_delivery_date();

-- Update existing records again to calculate next delivery date
UPDATE public.uniforms 
SET next_delivery_date = calculate_next_delivery_date(uniform_type, delivery_date)
WHERE next_delivery_date IS NULL;