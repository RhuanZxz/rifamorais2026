import { motion } from "framer-motion";
import { Trophy, Shirt, UtensilsCrossed } from "lucide-react";

const prizes = [
  {
    place: "1º lugar",
    title: "R$ 500,00",
    desc: "Prêmio em dinheiro entregue ao vencedor",
    Icon: Trophy,
    accent: "from-primary/25 to-primary/0",
  },
  {
    place: "2º lugar",
    title: "Camisa de time",
    desc: "Atlético ou Cruzeiro — você escolhe",
    Icon: Shirt,
    accent: "from-primary/15 to-primary/0",
  },
  {
    place: "3º lugar",
    title: "Voucher Coco Bambu",
    desc: "Jantar para aproveitar com quem você quiser",
    Icon: UtensilsCrossed,
    accent: "from-primary/10 to-primary/0",
  },
];

export function Prizes() {
  return (
    <section className="mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-medium mb-2">
            Premiação
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Concorra a três prêmios
          </h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {prizes.map((p, i) => (
          <motion.div
            key={p.place}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="surface-card rounded-2xl p-5 relative overflow-hidden group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {p.place}
                </span>
                <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/30 grid place-items-center">
                  <p.Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold tracking-tight leading-tight">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
