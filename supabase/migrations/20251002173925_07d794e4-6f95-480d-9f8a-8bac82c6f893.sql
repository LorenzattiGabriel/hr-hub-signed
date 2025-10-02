-- Create documents bucket for storing generated PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
);

-- Allow anyone to view documents
CREATE POLICY "Anyone can view documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

-- Allow anyone to upload documents
CREATE POLICY "Anyone can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to update documents
CREATE POLICY "Anyone can update documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'documents');

-- Allow anyone to delete documents
CREATE POLICY "Anyone can delete documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');

-- Add pdf_url column to documents table to store the storage path
ALTER TABLE public.documents
ADD COLUMN pdf_url TEXT;