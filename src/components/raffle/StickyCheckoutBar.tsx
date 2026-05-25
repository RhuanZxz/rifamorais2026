import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Copy, Check, MessageCircle } from "lucide-react";
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
  PIX_KEY,
  PIX_NAME,
} from "@/lib/raffle-config";
import { toast } from "sonner";

type Props = {
  selected: number[];
  onRemove: (n: number) => void;
  onClear: () => void;
};

type Step = "form" | "pix";

export function StickyCheckoutBar({ selected, onRemove, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [copied, setCopied] = useState(false);
  const total = selected.length * RAFFLE_PRICE;

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) {
      setTimeout(() => {
        setStep("form");
        setCopied(false);
      }, 200);
    }
  };

  const goPix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      toast.error("Preencha nome e telefone");
      return;
    }
    setStep("pix");
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      toast.success("Chave Pix copiada");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const goWhatsApp = () => {
    const url = buildWhatsAppLink(nome.trim(), telefone.trim(), selected);
    window.open(url, "_blank");
    toast.success("Abrindo WhatsApp...");
    handleOpenChange(false);
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
            <div className="surface-card glow-primary rounded-full pl-2 pr-2 py-2 flex items-center gap-3 sm:gap-5 backdrop-blur-xl bg-card/95">
              <button
                onClick={onClear}
                aria-label="Limpar seleção"
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-primary/8 text-muted-foreground hover:text-primary transition shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-sm font-semibold leading-tight text-primary">
                  {selected.length}{" "}
                  {selected.length === 1
                    ? "número selecionado"
                    : "números selecionados"}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  Total:{" "}
                  <span className="text-primary font-semibold">
                    R$ {total},00
                  </span>
                </p>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-semibold shrink-0 shadow-md"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Participar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="surface-card border-border max-w-md">
          {step === "form" ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary">
                  Finalizar reserva
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Em seguida você verá a chave Pix para pagamento.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border hairline p-4 bg-secondary/40">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold mb-2 font-medium">
                  Seus números
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {selected.map((n) => (
                    <button
                      key={n}
                      onClick={() => onRemove(n)}
                      className="group flex items-center gap-1 rounded-md bg-primary/8 border border-primary/20 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary hover:bg-primary/15"
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
                  <span className="text-2xl font-display font-semibold tabular-nums text-primary">
                    R$ {total},00
                  </span>
                </div>
              </div>

              <form onSubmit={goPix} className="space-y-3">
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
                  <Label className="text-xs text-muted-foreground">
                    Telefone
                  </Label>
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
                  Ver chave Pix
                </Button>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary">
                  Pagamento via Pix
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Realize o Pix no valor abaixo e envie o comprovante pelo
                  WhatsApp para confirmarmos sua reserva.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border hairline p-5 bg-secondary/40 space-y-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gold font-medium mb-1">
                    Valor a pagar
                  </p>
                  <p className="text-3xl font-display font-semibold text-primary tabular-nums">
                    R$ {total},00
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gold font-medium">
                    Chave Pix (telefone)
                  </p>
                  <button
                    onClick={copyPix}
                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-primary/25 bg-background px-4 py-3 hover:bg-primary/5 transition group"
                  >
                    <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                      {PIX_KEY}
                    </span>
                    {copied ? (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    )}
                  </button>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                    <span>Nome do recebedor</span>
                    <span className="text-primary font-medium">{PIX_NAME}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3">
                <p className="text-xs leading-relaxed text-foreground/80">
                  <span className="font-semibold text-gold">Importante:</span>{" "}
                  após o Pix, envie o comprovante no WhatsApp para que sua
                  reserva seja confirmada.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep("form")}
                  className="sm:flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={goWhatsApp}
                  className="sm:flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar comprovante no WhatsApp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
