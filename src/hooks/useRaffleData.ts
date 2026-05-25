import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { adminListBuyers } from "@/lib/raffle.functions";

export type Buyer = {
  id: string;
  nome: string;
  telefone: string;
  cidade: string | null;
  numeros: number[];
  created_at: string;
};

export function useBlockedNumbers() {
  const [blocked, setBlocked] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.rpc("list_blocked_numero");
    if (!error && data) {
      setBlocked(new Set((data as number[]) ?? []));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
    const id = setInterval(refetch, 10000);
    return () => clearInterval(id);
  }, [refetch]);

  return { blocked, loading, refetch };
}

export function useBuyers(auth: { username: string; password: string } | null) {
  const list = useServerFn(adminListBuyers);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!auth) return;
    try {
      const res = await list({ data: auth });
      setBuyers((res.buyers as Buyer[]) ?? []);
    } catch {
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  }, [auth, list]);

  useEffect(() => {
    refetch();
    const id = setInterval(refetch, 15000);
    return () => clearInterval(id);
  }, [refetch]);

  return { buyers, loading, refetch };
}
