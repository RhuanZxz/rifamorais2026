import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  RAFFLE_PRICE,
  buildWhatsAppLink,
  formatNumber,
} from "@/lib/raffle-config";
import { toast } from "sonner";

type Props = {
  selected: number[];
  onRemove: (n: number) => void;
  onClear: () => void;
};

export function StickyCheckoutBar({ selected, onRemove, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const total = selected.length * RAFFLE_PRICE;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      toast.error("Preencha nome e telefone");
      return;
    }
    const url = buildWhatsAppLink(nome.trim(), telefone.trim(), selected);
    window.open(url, "_blank");
    toast.success("Abrindo WhatsApp...");
    setOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40"
          >
            <div className="surface-card glow-primary rounded-2xl px-4 py-3 flex items-center gap-3 sm:gap-5 backdrop-blur-xl bg-card/95 shadow-2xl">
              <button
                onClick={onClear}
                aria-label="Limpar seleção"
                className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">
                  {selected.length}{" "}
                  {selected.length === 1
                    ? "número selecionado"
                    : "números selecionados"}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  Total: <span className="text-primary font-medium">R$ {total},00</span>
                </p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 sm:px-6 font-semibold shrink-0"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Participar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="surface-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar reserva</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enviaremos sua solicitação pelo WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border hairline p-3 bg-background/40">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Seus números
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {selected.map((n) => (
                <button
                  key={n}
                  onClick={() => onRemove(n)}
                  className="group flex items-center gap-1 rounded-md bg-primary/10 border border-primary/25 px-2 py-0.5 text-xs font-medium tabular-nums text-primary hover:bg-primary/15"
                >
                  {formatNumber(n)}
                  <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                </button>
              ))}
            </div>
            <div className="flex justify-between items-baseline pt-3 mt-3 border-t hairline">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Total
              </span>
              <span className="text-xl font-semibold tabular-nums">
                R$ {total},00
              </span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                maxLength={120}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Telefone</Label>
              <Input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={40}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
            >
              Enviar pelo WhatsApp
            </Button>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed text-center">
              A reserva é confirmada manualmente após o pagamento.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
