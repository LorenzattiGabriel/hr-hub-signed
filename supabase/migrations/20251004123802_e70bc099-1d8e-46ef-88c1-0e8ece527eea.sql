-- Crear tabla de registro de pagos
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('salary', 'advance', 'commission', 'deduction')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  period VARCHAR NOT NULL,
  payment_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acceso completo
CREATE POLICY "Anyone can view payroll"
  ON public.payroll
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert payroll"
  ON public.payroll
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update payroll"
  ON public.payroll
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete payroll"
  ON public.payroll
  FOR DELETE
  USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();