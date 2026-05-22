ALTER TABLE public.blocked_numbers
DROP CONSTRAINT IF EXISTS blocked_numbers_buyer_id_fkey;

ALTER TABLE public.blocked_numbers
ADD CONSTRAINT blocked_numbers_buyer_id_fkey
FOREIGN KEY (buyer_id) REFERENCES public.buyers(id) ON DELETE CASCADE;