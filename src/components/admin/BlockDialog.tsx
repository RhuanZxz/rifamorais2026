import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminBlockNumbers, adminUnblockNumbers } from "@/lib/raffle.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseNumberInput } from "@/lib/raffle-config";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  auth: { username: string; password: string };
  mode: "block" | "unblock";
  onDone?: () => void;
};

export function BlockDialog({ open, onOpenChange, auth, mode, onDone }: Props) {
  const block = useServerFn(adminBlockNumbers);
  const unblock = useServerFn(adminUnblockNumbers);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = parseNumberInput(txt);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsed.length === 0) {
      toast.error("Informe ao menos um número");
      return;
    }
    setLoading(true);
    try {
      if (mode === "block") {
        await block({ data: { ...auth, numeros: parsed } });
        toast.success(`${parsed.length} número(s) bloqueado(s)`);
      } else {
        await unblock({ data: { ...auth, numeros: parsed } });
        toast.success(`${parsed.length} número(s) liberado(s)`);
      }
      setTxt("");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "block" ? "Bloquear números" : "Liberar números"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "block"
              ? "Bloqueio manual (sem comprador). Aceita 1,2,3 ou 1-50."
              : "Libera apenas bloqueios manuais. Não afeta compradores."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Números</Label>
            <Textarea
              value={txt}
              onChange={(e) => setTxt(e.target.value)}
              rows={3}
              placeholder="Ex: 1-10, 99, 500-510"
            />
            <p className="text-xs text-muted-foreground tabular-nums pt-1">
              {parsed.length} número(s)
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "..." : "Confirmar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
