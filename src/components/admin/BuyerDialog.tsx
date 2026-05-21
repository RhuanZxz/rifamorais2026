import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminCreateBuyer,
  adminUpdateBuyer,
} from "@/lib/raffle.functions";
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
import { Textarea } from "@/components/ui/textarea";
import { parseNumberInput, RAFFLE_PRICE } from "@/lib/raffle-config";
import { toast } from "sonner";
import type { Buyer } from "@/hooks/useRaffleData";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  auth: { username: string; password: string };
  editing: Buyer | null;
  onDone: () => void;
};

export function BuyerDialog({ open, onOpenChange, auth, editing, onDone }: Props) {
  const create = useServerFn(adminCreateBuyer);
  const update = useServerFn(adminUpdateBuyer);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [numerosTxt, setNumerosTxt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNome(editing?.nome ?? "");
      setTelefone(editing?.telefone ?? "");
      setCidade(editing?.cidade ?? "");
      setNumerosTxt(editing ? editing.numeros.join(", ") : "");
    }
  }, [open, editing]);

  const parsed = parseNumberInput(numerosTxt);
  const total = parsed.length * RAFFLE_PRICE;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }
    if (parsed.length === 0) {
      toast.error("Informe ao menos um número válido");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...auth,
        nome: nome.trim(),
        telefone: telefone.trim(),
        cidade: cidade.trim() || null,
        numeros: parsed,
      };
      if (editing) {
        await update({ data: { ...payload, id: editing.id } });
        toast.success("Comprador atualizado");
      } else {
        await create({ data: payload });
        toast.success("Comprador cadastrado");
      }
      onDone();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar comprador" : "Cadastrar compra"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Os números serão bloqueados automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Telefone</Label>
              <Input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Cidade (opcional)
            </Label>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Números — aceita 1,2,3 ou 1-50
            </Label>
            <Textarea
              value={numerosTxt}
              onChange={(e) => setNumerosTxt(e.target.value)}
              rows={3}
              placeholder="Ex: 1, 5, 10-25, 100"
            />
            <div className="flex justify-between text-xs text-muted-foreground tabular-nums pt-1">
              <span>{parsed.length} número(s)</span>
              <span>R$ {total},00</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
