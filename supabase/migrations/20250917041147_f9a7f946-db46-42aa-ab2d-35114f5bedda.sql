-- Create uniforms table for proper data persistence
CREATE TABLE public.uniforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  uniform_type VARCHAR(100) NOT NULL,
  size VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  delivery_date DATE NOT NULL,
  season VARCHAR(20) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'entregado' CHECK (status IN ('entregado', 'pendiente', 'devuelto')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uniforms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view uniforms" 
ON public.uniforms 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert uniforms" 
ON public.uniforms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update uniforms" 
ON public.uniforms 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete uniforms" 
ON public.uniforms 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_uniforms_updated_at
BEFORE UPDATE ON public.uniforms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_uniforms_employee_id ON public.uniforms(employee_id);
CREATE INDEX idx_uniforms_status ON public.uniforms(status);
CREATE INDEX idx_uniforms_delivery_date ON public.uniforms(delivery_date);