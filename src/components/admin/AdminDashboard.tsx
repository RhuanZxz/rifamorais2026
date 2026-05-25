import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminDeleteBuyer } from "@/lib/raffle.functions";
import { useBuyers, useBlockedNumbers, type Buyer } from "@/hooks/useRaffleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuyerDialog } from "./BuyerDialog";
import { BlockDialog } from "./BlockDialog";
import {
  RAFFLE_PRICE,
  RAFFLE_TITLE,
  RAFFLE_TOTAL,
  formatNumber,
} from "@/lib/raffle-config";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Lock, Unlock, LogOut, Search } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  auth: { username: string; password: string };
  onLogout: () => void;
};

export function AdminDashboard({ auth, onLogout }: Props) {
  const { buyers, loading, refetch } = useBuyers(auth);
  const { blocked, refetch: refetchBlocked } = useBlockedNumbers();
  const del = useServerFn(adminDeleteBuyer);

  const [query, setQuery] = useState("");
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [editing, setEditing] = useState<Buyer | null>(null);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockMode, setBlockMode] = useState<"block" | "unblock">("block");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buyers;
    const num = parseInt(q, 10);
    return buyers.filter(
      (b) =>
        b.nome.toLowerCase().includes(q) ||
        b.telefone.toLowerCase().includes(q) ||
        (Number.isInteger(num) && b.numeros.includes(num)),
    );
  }, [buyers, query]);

  const totalNumbers = buyers.reduce((s, b) => s + b.numeros.length, 0);
  const revenue = totalNumbers * RAFFLE_PRICE;
  const sold = blocked.size;

  const handleDelete = async (b: Buyer) => {
    if (!confirm(`Remover ${b.nome}? Os números serão liberados.`)) return;
    try {
      await del({ data: { ...auth, id: b.id } });
      toast.success("Comprador removido");
      refetch();
      refetchBlocked();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b hairline">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Painel admin</p>
            <h1 className="text-sm font-semibold tracking-tight">{RAFFLE_TITLE}</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <Stat label="Compradores" value={buyers.length.toString()} />
          <Stat
            label="Números vendidos"
            value={`${sold} / ${RAFFLE_TOTAL}`}
          />
          <Stat label="Total arrecadado" value={`R$ ${revenue},00`} />
          <Stat
            label="Disponíveis"
            value={(RAFFLE_TOTAL - sold).toString()}
          />
        </motion.div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setEditing(null);
              setBuyerOpen(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" /> Cadastrar compra
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setBlockMode("block");
              setBlockOpen(true);
            }}
          >
            <Lock className="h-4 w-4 mr-2" /> Bloquear números
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setBlockMode("unblock");
              setBlockOpen(true);
            }}
          >
            <Unlock className="h-4 w-4 mr-2" /> Liberar números
          </Button>
        </div>

        <div className="surface-card rounded-xl overflow-hidden">
          <div className="p-4 border-b hairline flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar por nome, telefone ou número"
              className="border-0 bg-transparent focus-visible:ring-0 px-0"
            />
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Nenhum comprador encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase tracking-wider">
                  <tr className="border-b hairline">
                    <th className="text-left font-medium px-4 py-3">Nome</th>
                    <th className="text-left font-medium px-4 py-3">Telefone</th>
                    <th className="text-left font-medium px-4 py-3">Cidade</th>
                    <th className="text-left font-medium px-4 py-3">Números</th>
                    <th className="text-right font-medium px-4 py-3">Total</th>
                    <th className="text-left font-medium px-4 py-3">Data</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b hairline last:border-0 hover:bg-card-hover/40 transition"
                    >
                      <td className="px-4 py-3 font-medium">{b.nome}</td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {b.telefone}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {b.cidade ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {b.numeros.slice(0, 8).map((n) => (
                            <span
                              key={n}
                              className="text-[11px] tabular-nums px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                            >
                              {formatNumber(n)}
                            </span>
                          ))}
                          {b.numeros.length > 8 && (
                            <span className="text-[11px] text-muted-foreground self-center">
                              +{b.numeros.length - 8}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        R$ {b.numeros.length * RAFFLE_PRICE},00
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(b.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditing(b);
                              setBuyerOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(b)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <BuyerDialog
        open={buyerOpen}
        onOpenChange={setBuyerOpen}
        auth={auth}
        editing={editing}
        onDone={() => {}}
      />
      <BlockDialog
        open={blockOpen}
        onOpenChange={setBlockOpen}
        auth={auth}
        mode={blockMode}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
    </div>
  );
}
