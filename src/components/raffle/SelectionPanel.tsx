import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RAFFLE_PRICE, buildWhatsAppLink, formatNumber } from "@/lib/raffle-config";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
  selected: number[];
  onRemove: (n: number) => void;
  onClear: () => void;
};

export function SelectionPanel({ selected, onRemove, onClear }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const total = selected.length * RAFFLE_PRICE;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      toast.error("Preencha nome e telefone");
      return;
    }
    if (selected.length === 0) {
      toast.error("Selecione ao menos um numero");
      return;
    }
    const url = buildWhatsAppLink(nome.trim(), telefone.trim(), selected);
    window.open(url, "_blank");
    toast.success("Abrindo WhatsApp...");
  };

  return (
    <div className="surface-card rounded-xl p-6 lg:sticky lg:top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-tight">Sua seleção</h3>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            limpar
          </button>
        )}
      </div>

      <div className="min-h-[60px] mb-5">
        {selected.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum número selecionado.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence initial={false}>
              {selected.map((n) => (
                <motion.button
                  key={n}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => onRemove(n)}
                  className="group flex items-center gap-1 rounded-md bg-primary/10 border border-primary/25 px-2 py-1 text-xs font-medium tabular-nums text-primary hover:bg-primary/15 transition"
                >
                  {formatNumber(n)}
                  <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t hairline pt-4 mb-5 flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Total
        </span>
        <motion.span
          key={total}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold tabular-nums"
        >
          R$ {total},00
        </motion.span>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="nome" className="text-xs text-muted-foreground">
            Nome
          </Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
            maxLength={120}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefone" className="text-xs text-muted-foreground">
            Telefone
          </Label>
          <Input
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            maxLength={40}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          disabled={selected.length === 0}
        >
          Enviar solicitação
        </Button>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-1">
          A solicitação é enviada pelo WhatsApp. A reserva é confirmada
          manualmente após o pagamento.
        </p>
      </form>
    </div>
  );
}
