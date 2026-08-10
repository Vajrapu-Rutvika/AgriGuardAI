ALTER TABLE public.fields
  ADD COLUMN IF NOT EXISTS size numeric,
  ADD COLUMN IF NOT EXISTS size_unit text NOT NULL DEFAULT 'acre',
  ADD COLUMN IF NOT EXISTS location_text text,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS crop_variety text,
  ADD COLUMN IF NOT EXISTS growth_stage text,
  ADD COLUMN IF NOT EXISTS health_status text,
  ADD COLUMN IF NOT EXISTS known_problem text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS fields_one_active_per_user
  ON public.fields (user_id) WHERE is_active;

CREATE TABLE IF NOT EXISTS public.field_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id uuid NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  title text,
  summary text,
  image_url text,
  diagnosis text,
  confidence numeric,
  severity text,
  weather jsonb,
  recommendations jsonb,
  action_window jsonb,
  risks jsonb,
  actions_taken jsonb,
  follow_up jsonb,
  recovery_status text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.field_events TO authenticated;
GRANT ALL ON public.field_events TO service_role;

ALTER TABLE public.field_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage their own field history"
  ON public.field_events FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS field_events_field_id_idx ON public.field_events (field_id, occurred_at DESC);

CREATE TRIGGER update_field_events_updated_at
  BEFORE UPDATE ON public.field_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();