-- Drop public read policies
DROP POLICY IF EXISTS "Public can read buyers" ON public.buyers;
DROP POLICY IF EXISTS "Public can read blocked_numbers" ON public.blocked_numbers;

-- Remove tables from realtime publication (ignore if not present)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.buyers';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.blocked_numbers';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Safe public accessor: only exposes the raffle numbers that are taken
CREATE OR REPLACE FUNCTION public.list_blocked_numero()
RETURNS SETOF integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT numero FROM public.blocked_numbers
$$;

REVOKE ALL ON FUNCTION public.list_blocked_numero() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_blocked_numero() TO anon, authenticated;