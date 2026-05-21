import { memo } from "react";
import { cn } from "@/lib/utils";
import { RAFFLE_TOTAL } from "@/lib/raffle-config";

type Props = {
  blocked: Set<number>;
  selected: Set<number>;
  onToggle: (n: number) => void;
};

function NumberCell({
  n,
  state,
  onClick,
}: {
  n: number;
  state: "free" | "selected" | "blocked";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={state === "blocked" ? undefined : onClick}
      disabled={state === "blocked"}
      aria-label={`Numero ${n}`}
      className={cn(
        "h-11 rounded-md text-xs font-medium tabular-nums transition-colors duration-150 border border-white/[0.04]",
        state === "free" &&
          "bg-[oklch(0.22_0.04_165)] text-foreground/80 hover:bg-[oklch(0.27_0.05_148)] hover:text-foreground hover:border-primary/30",
        state === "selected" &&
          "bg-primary text-primary-foreground border-primary/60 shadow-[0_0_0_1px_rgba(22,163,74,0.4)]",
        state === "blocked" &&
          "bg-[oklch(0.20_0.01_165)] text-muted-foreground/40 cursor-not-allowed opacity-60",
      )}
    >
      {n.toString().padStart(4, "0")}
    </button>
  );
}

const MemoCell = memo(NumberCell);

function NumberGridImpl({ blocked, selected, onToggle }: Props) {
  const cells = [];
  for (let n = 1; n <= RAFFLE_TOTAL; n++) {
    const state: "free" | "selected" | "blocked" = blocked.has(n)
      ? "blocked"
      : selected.has(n)
        ? "selected"
        : "free";
    cells.push(
      <MemoCell key={n} n={n} state={state} onClick={() => onToggle(n)} />,
    );
  }
  return (
    <div className="grid gap-1.5 grid-cols-[repeat(auto-fill,minmax(60px,1fr))]">
      {cells}
    </div>
  );
}

export const NumberGrid = memo(NumberGridImpl);
