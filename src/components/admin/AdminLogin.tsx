import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminLogin } from "@/lib/raffle.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  onAuth: (username: string, password: string) => void;
};

export function AdminLogin({ onAuth }: Props) {
  const login = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ data: { username, password } });
      onAuth(username, password);
    } catch {
      toast.error("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-5">
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="surface-card rounded-xl p-7 w-full max-w-sm"
      >
        <h1 className="text-lg font-semibold tracking-tight">Painel admin</h1>
        <p className="text-xs text-muted-foreground mt-1 mb-6">
          Acesso restrito.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="user" className="text-xs text-muted-foreground">
              Usuário
            </Label>
            <Input
              id="user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pwd" className="text-xs text-muted-foreground">
              Senha
            </Label>
            <Input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
