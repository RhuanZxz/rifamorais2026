import { motion } from "framer-motion";
import { Trophy, Shirt, UtensilsCrossed } from "lucide-react";

const prizes = [
  {
    place: "Primeiro lugar",
    title: "R$ 500,00",
    desc: "Prêmio em dinheiro entregue ao vencedor",
    Icon: Trophy,
  },
  {
    place: "Segundo lugar",
    title: "Camisa de time",
    desc: "Atlético ou Cruzeiro — você escolhe",
    Icon: Shirt,
  },
  {
    place: "Terceiro lugar",
    title: "Voucher Coco Bambu",
    desc: "Jantar para aproveitar com quem quiser",
    Icon: UtensilsCrossed,
  },
];

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z" />
    </svg>
  );
}

export function Prizes() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <div className="gold-divider max-w-xs mx-auto mb-4">
          <Sparkle className="h-3 w-3" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-medium mb-3">
          Premiação
        </p>
        <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-primary">
          Três prêmios à sua espera
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        {prizes.map((p, i) => (
          <motion.div
            key={p.place}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="surface-card rounded-2xl p-7 text-center relative overflow-hidden group"
          >
            <Sparkle className="absolute top-3 right-3 h-2.5 w-2.5 text-gold/40" />
            <Sparkle className="absolute bottom-3 left-3 h-2 w-2 text-gold/30" />

            <div className="h-14 w-14 mx-auto rounded-full bg-primary/8 border border-primary/20 grid place-items-center mb-5">
              <p.Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>

            <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-medium mb-2">
              {p.place}
            </p>
            <h3 className="text-2xl font-display font-semibold tracking-tight text-primary leading-tight">
              {p.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
