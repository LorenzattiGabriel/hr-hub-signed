-- Add foreign key constraint to documents table
ALTER TABLE public.documents
ADD CONSTRAINT documents_employee_id_fkey 
FOREIGN KEY (employee_id) 
REFERENCES public.employees(id) 
ON DELETE CASCADE;