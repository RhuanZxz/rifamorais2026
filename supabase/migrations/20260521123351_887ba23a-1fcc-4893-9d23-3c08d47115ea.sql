
CREATE TABLE public.buyers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT,
  numeros INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.blocked_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE,
  buyer_id UUID REFERENCES public.buyers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blocked_numbers_numero ON public.blocked_numbers(numero);
CREATE INDEX idx_blocked_numbers_buyer ON public.blocked_numbers(buyer_id);

ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_numbers ENABLE ROW LEVEL SECURITY;

-- Public read so the raffle grid can show what's taken
CREATE POLICY "Public can read buyers" ON public.buyers FOR SELECT USING (true);
CREATE POLICY "Public can read blocked_numbers" ON public.blocked_numbers FOR SELECT USING (true);
-- No insert/update/delete policies => only service_role (server admin) can mutate
