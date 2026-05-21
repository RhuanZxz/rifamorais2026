
ALTER PUBLICATION supabase_realtime ADD TABLE public.buyers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_numbers;
ALTER TABLE public.buyers REPLICA IDENTITY FULL;
ALTER TABLE public.blocked_numbers REPLICA IDENTITY FULL;
