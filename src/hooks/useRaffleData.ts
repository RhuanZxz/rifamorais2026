import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
      .from("blocked_numbers")
      .select("numero")
      .limit(10000);
    if (!error && data) {
      setBlocked(new Set(data.map((r) => r.numero)));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
    const channel = supabase
      .channel("blocked_numbers_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blocked_numbers" },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { blocked, loading, refetch };
}

export function useBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from("buyers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (!error && data) setBuyers(data as Buyer[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
    const ch = supabase
      .channel("buyers_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buyers" },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refetch]);

  return { buyers, loading, refetch };
}
