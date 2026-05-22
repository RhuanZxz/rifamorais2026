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
        "aspect-square rounded-full text-sm font-medium tabular-nums transition-all duration-150 grid place-items-center select-none font-display",
        state === "free" &&
          "bg-card border border-primary/25 text-primary hover:border-primary hover:bg-primary/8 hover:scale-[1.05] shadow-sm",
        state === "selected" &&
          "bg-primary text-primary-foreground border border-primary shadow-[0_0_0_3px_oklch(0.36_0.09_155/0.18)] scale-[1.04]",
        state === "blocked" &&
          "bg-muted border border-primary/10 text-primary/30 cursor-not-allowed line-through",
      )}
    >
      {n}
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
    <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(48px,1fr))]">
      {cells}
    </div>
  );
}

export const NumberGrid = memo(NumberGridImpl);
