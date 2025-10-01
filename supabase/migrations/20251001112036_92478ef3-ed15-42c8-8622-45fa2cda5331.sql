-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  document_type VARCHAR NOT NULL,
  generated_date DATE NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'generado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  document_content TEXT,
  signed_date DATE,
  observations TEXT
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view documents" 
ON public.documents 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update documents" 
ON public.documents 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete documents" 
ON public.documents 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();