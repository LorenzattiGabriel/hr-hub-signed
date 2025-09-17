-- Add next_delivery_date column to uniforms table
ALTER TABLE public.uniforms 
ADD COLUMN next_delivery_date date;

-- Create function to calculate next delivery date based on uniform type
CREATE OR REPLACE FUNCTION public.calculate_next_delivery_date(
  uniform_type_param text,
  delivery_date_param date
) RETURNS date AS $$
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
$$ LANGUAGE plpgsql;

-- Update existing records to calculate next delivery date
UPDATE public.uniforms 
SET next_delivery_date = calculate_next_delivery_date(uniform_type, delivery_date)
WHERE next_delivery_date IS NULL;

-- Create trigger to automatically calculate next_delivery_date on insert/update
CREATE OR REPLACE FUNCTION public.trigger_calculate_next_delivery_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_delivery_date = calculate_next_delivery_date(NEW.uniform_type, NEW.delivery_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_next_delivery_date_trigger
  BEFORE INSERT OR UPDATE ON public.uniforms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calculate_next_delivery_date();