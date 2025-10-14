-- Add galpon column to uniforms table
-- Galpon is optional (nullable) and represents a numeric value from 1 to 5

ALTER TABLE public.uniforms 
ADD COLUMN galpon INTEGER;

-- Add constraint to ensure galpon is between 1 and 5 when not null
ALTER TABLE public.uniforms 
ADD CONSTRAINT galpon_range_check 
CHECK (galpon IS NULL OR (galpon >= 1 AND galpon <= 5));

-- Add comment to document the column
COMMENT ON COLUMN public.uniforms.galpon IS 'Número de galpón (1-5), opcional';

-- Create index for better performance when filtering by galpon
CREATE INDEX idx_uniforms_galpon ON public.uniforms(galpon) WHERE galpon IS NOT NULL;
