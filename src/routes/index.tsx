import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { NumberGrid } from "@/components/raffle/NumberGrid";
import { SelectionPanel } from "@/components/raffle/SelectionPanel";
import { useBlockedNumbers } from "@/hooks/useRaffleData";
import { RAFFLE_PRICE, RAFFLE_TITLE, RAFFLE_TOTAL } from "@/lib/raffle-config";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rifa Professor Morais — Escolha seus números" },
      {
        name: "description",
        content:
          "Plataforma oficial da Rifa Professor Morais. R$10 por número, seleção múltipla e reserva confirmada manualmente.",
      },
      { property: "og:title", content: "Rifa Professor Morais" },
      {
        property: "og:description",
        content: "Escolha seus números. R$10 cada. Reserva via WhatsApp.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { blocked, loading } = useBlockedNumbers();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (n: number) => {
    if (blocked.has(n)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const selectedSorted = useMemo(
    () => [...selected].sort((a, b) => a - b),
    [selected],
  );

  const available = RAFFLE_TOTAL - blocked.size;

  return (
    <div className="min-h-screen bg-background">
      <Toaster theme="dark" position="top-center" />
      <header className="border-b hairline">
        <div className="mx-auto max-w-7xl px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
              <div className="h-2 w-2 rounded-sm bg-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {RAFFLE_TITLE}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-muted-foreground tabular-nums">
            <span>
              <span className="text-foreground font-medium">{available}</span> /{" "}
              {RAFFLE_TOTAL} disponíveis
            </span>
            <span className="h-3 w-px bg-border" />
            <span>R$ {RAFFLE_PRICE} por número</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10 lg:mb-14 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            Escolha seus números
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            R$ {RAFFLE_PRICE} por número • seleção múltipla. Toque nos números
            livres para reservar e envie sua solicitação pelo WhatsApp.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <section>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
              <Legend dotClass="bg-[oklch(0.22_0.04_165)] border border-white/10" label="Livre" />
              <Legend dotClass="bg-primary" label="Selecionado" />
              <Legend dotClass="bg-[oklch(0.20_0.01_165)] opacity-60 border border-white/5" label="Bloqueado" />
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : (
              <NumberGrid
                blocked={blocked}
                selected={selected}
                onToggle={toggle}
              />
            )}
          </section>

          <aside>
            <SelectionPanel
              selected={selectedSorted}
              onRemove={(n) =>
                setSelected((p) => {
                  const next = new Set(p);
                  next.delete(n);
                  return next;
                })
              }
              onClear={() => setSelected(new Set())}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t hairline mt-16">
        <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {RAFFLE_TITLE}
        </div>
      </footer>
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-sm ${dotClass}`} />
      <span>{label}</span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-1.5 grid-cols-[repeat(auto-fill,minmax(60px,1fr))]">
      {Array.from({ length: 120 }).map((_, i) => (
        <div
          key={i}
          className="h-11 rounded-md bg-card animate-pulse opacity-50"
        />
      ))}
    </div>
  );
}
