import { cn } from "@/lib/utils";

interface ScoreRingProps {
  value: number;
  size?: "sm" | "lg";
  label?: string;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ value, size = "lg", label = "cocok" }: ScoreRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className={cn("relative grid shrink-0 place-items-center", size === "lg" ? "size-32" : "size-20")}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="9" className="stroke-secondary" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p className={cn("font-bold leading-none text-foreground", size === "lg" ? "text-3xl" : "text-lg")}>{clamped}%</p>
        <p className={cn("mt-1 text-muted-foreground", size === "lg" ? "text-xs" : "text-[10px]")}>{label}</p>
      </div>
    </div>
  );
}
