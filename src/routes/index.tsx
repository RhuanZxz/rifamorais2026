import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { NumberGrid } from "@/components/raffle/NumberGrid";
import { StickyCheckoutBar } from "@/components/raffle/StickyCheckoutBar";
import { Prizes } from "@/components/raffle/Prizes";
import { useBlockedNumbers } from "@/hooks/useRaffleData";
import { RAFFLE_PRICE, RAFFLE_TITLE, RAFFLE_TOTAL } from "@/lib/raffle-config";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rifa Professor Morais — Concorra a R$500 e mais prêmios" },
      {
        name: "description",
        content:
          "Participe da Rifa Professor Morais. R$10 por número, três prêmios: R$500, camisa de time e voucher Coco Bambu.",
      },
      { property: "og:title", content: "Rifa Professor Morais" },
      {
        property: "og:description",
        content:
          "R$500 em dinheiro, camisa de time e voucher Coco Bambu. Apenas R$10 por número.",
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
  const progress = Math.round((blocked.size / RAFFLE_TOTAL) * 100);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Toaster theme="dark" position="top-center" />

      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <header className="border-b hairline backdrop-blur-md bg-background/60 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center">
              <div className="h-2 w-2 rounded-sm bg-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {RAFFLE_TITLE}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
            <span>
              <span className="text-foreground font-medium">{available}</span> /{" "}
              {RAFFLE_TOTAL} disponíveis
            </span>
            <span className="h-3 w-px bg-border" />
            <span>R$ {RAFFLE_PRICE} por número</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 lg:mb-20 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Rifa oficial — sorteio confirmado
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]">
            Concorra a{" "}
            <span className="text-primary">R$ 500</span>, camisa de time
            e voucher Coco Bambu.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Escolha quantos números quiser por apenas{" "}
            <span className="text-foreground font-medium">R$ {RAFFLE_PRICE},00</span>{" "}
            cada. Reserva confirmada via WhatsApp.
          </p>

          {/* Progress */}
          <div className="mt-8 max-w-md">
            <div className="flex justify-between text-xs text-muted-foreground mb-2 tabular-nums">
              <span>Vendidos</span>
              <span>
                {blocked.size} / {RAFFLE_TOTAL} · {progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-card overflow-hidden border hairline">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
              />
            </div>
          </div>
        </motion.section>

        <Prizes />

        {/* Grid */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-medium mb-2">
                Escolha seus números
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Toque nos números livres
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Legend dotClass="bg-card border border-primary/25" label="Livre" />
              <Legend dotClass="bg-primary" label="Selecionado" />
              <Legend dotClass="bg-card/50 border border-white/5 opacity-60" label="Vendido" />
            </div>
          </div>

          <div className="surface-card rounded-2xl p-4 sm:p-6">
            {loading ? <SkeletonGrid /> : (
              <NumberGrid
                blocked={blocked}
                selected={selected}
                onToggle={toggle}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="border-t hairline">
        <div className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {RAFFLE_TITLE}
        </div>
      </footer>

      <StickyCheckoutBar
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
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <span>{label}</span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(48px,1fr))]">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-full bg-card animate-pulse opacity-50"
        />
      ))}
    </div>
  );
}
