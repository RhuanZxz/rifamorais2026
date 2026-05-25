import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { NumberGrid } from "@/components/raffle/NumberGrid";
import { StickyCheckoutBar } from "@/components/raffle/StickyCheckoutBar";
import { Prizes } from "@/components/raffle/Prizes";
import { useBlockedNumbers } from "@/hooks/useRaffleData";
import { RAFFLE_PRICE, RAFFLE_TITLE, RAFFLE_TOTAL } from "@/lib/raffle-config";
import { motion } from "framer-motion";
import logo from "@/assets/logo-comissao.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rifa Professor Morais — Comissão EEPM 2026" },
      {
        name: "description",
        content:
          "Rifa oficial da Comissão de Formatura EEPM 2026. Concorra a R$500, camisa de time e voucher Coco Bambu. Apenas R$10 por número.",
      },
      { property: "og:title", content: "Rifa Professor Morais — Comissão 2026" },
      {
        property: "og:description",
        content:
          "R$500, camisa de time e voucher Coco Bambu. Apenas R$10 por número.",
      },
    ],
  }),
  component: HomePage,
});

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z" />
    </svg>
  );
}

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
    <div className="min-h-screen pb-32">
      <Toaster theme="light" position="top-center" />

      <header className="border-b hairline backdrop-blur-md bg-background/70 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Comissão EEPM 2026"
              className="h-10 w-10 rounded-full object-cover border border-primary/20"
            />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold font-medium">
                Comissão 2026
              </p>
              <span className="text-sm font-display font-semibold tracking-tight text-primary">
                {RAFFLE_TITLE}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
            <span>
              <span className="text-primary font-semibold">{available}</span> /{" "}
              {RAFFLE_TOTAL} disponíveis
            </span>
            <span className="h-3 w-px bg-primary/20" />
            <span>R$ {RAFFLE_PRICE} por número</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <motion.img
            src={logo}
            alt="EEPM Comissão 2026"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto mb-10 h-44 w-44 sm:h-52 sm:w-52 rounded-2xl object-cover shadow-[0_20px_60px_-20px_rgba(40,80,55,0.35)] border border-primary/15"
          />

          <div className="gold-divider max-w-[260px] mx-auto mb-5">
            <Sparkle className="h-3 w-3" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.36em] text-gold font-semibold mb-4">
            Rifa oficial · Formatura 2026
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-primary leading-[1.02] max-w-4xl mx-auto">
            Rifa do{" "}
            <em className="italic text-gold">Professor Morais</em>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Ajude nossa formatura e concorra a três prêmios especiais. Cada
            número custa apenas{" "}
            <span className="text-primary font-semibold">
              R$ {RAFFLE_PRICE},00
            </span>
            . Reserva pelo WhatsApp.
          </p>

          <div className="gold-divider max-w-[260px] mx-auto mt-10">
            <Sparkle className="h-3 w-3" />
          </div>
        </motion.section>

        <Prizes />

        {/* Sentimental note */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="surface-card rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto text-center relative overflow-hidden">
            <Sparkle className="absolute top-4 left-4 h-2.5 w-2.5 text-gold/40" />
            <Sparkle className="absolute top-4 right-4 h-2 w-2 text-gold/30" />
            <Sparkle className="absolute bottom-4 left-4 h-2 w-2 text-gold/30" />
            <Sparkle className="absolute bottom-4 right-4 h-2.5 w-2.5 text-gold/40" />

            <p className="text-[10px] uppercase tracking-[0.32em] text-gold font-medium mb-4">
              Uma palavra da turma
            </p>
            <p className="font-display text-2xl sm:text-3xl text-primary leading-snug italic">
              “Cada número comprado é um passo para realizarmos o sonho da
              nossa formatura.”
            </p>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Essa rifa é feita com carinho pela turma do{" "}
              <span className="text-primary font-medium">Professor Morais</span>.
              Sua contribuição nos ajuda a celebrar o fim de uma jornada que
              vivemos juntos — e o início de tudo o que vem pela frente. Muito
              obrigado por fazer parte desse momento com a gente. 💚
            </p>
          </div>
        </motion.section>


        {/* Grid */}
        <section>
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-medium mb-3">
              Escolha seus números
            </p>
            <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-primary">
              Toque para selecionar
            </h2>
            <div className="flex items-center justify-center gap-5 text-[11px] uppercase tracking-wider text-muted-foreground mt-5">
              <Legend dotClass="bg-card border border-primary/25" label="Livre" />
              <Legend dotClass="bg-primary" label="Selecionado" />
              <Legend dotClass="bg-muted border border-primary/10" label="Vendido" />
            </div>
          </div>

          <div className="surface-card rounded-2xl p-4 sm:p-6">
            {loading ? (
              <SkeletonGrid />
            ) : (
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
        <div className="mx-auto max-w-6xl px-5 py-8 text-center">
          <div className="gold-divider max-w-[200px] mx-auto mb-4">
            <Sparkle className="h-2.5 w-2.5" />
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {RAFFLE_TITLE} · Comissão de Formatura
            EEPM 2026
          </p>
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
          className="aspect-square rounded-full bg-muted animate-pulse opacity-60"
        />
      ))}
    </div>
  );
}
