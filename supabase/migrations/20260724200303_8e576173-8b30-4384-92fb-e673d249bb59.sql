
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  operation text NOT NULL CHECK (operation IN ('Venta','Alquiler')),
  rental_status text NOT NULL DEFAULT 'Disponible' CHECK (rental_status IN ('Disponible','Alquilada')),
  province text NOT NULL,
  city text,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  parking integer NOT NULL DEFAULT 0,
  sqm numeric NOT NULL DEFAULT 0,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Public can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update properties"
  ON public.properties FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "Public can delete properties"
  ON public.properties FOR DELETE
  USING (true);

CREATE INDEX properties_operation_idx ON public.properties(operation);
CREATE INDEX properties_province_idx ON public.properties(province);
