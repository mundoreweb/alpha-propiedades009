ALTER TABLE public.properties ALTER COLUMN bathrooms TYPE numeric USING bathrooms::numeric;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_code text;
CREATE INDEX IF NOT EXISTS properties_property_code_idx ON public.properties (property_code);