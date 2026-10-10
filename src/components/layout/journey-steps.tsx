import Link from "next/link";
import { Check } from "lucide-react";
import { JOURNEY_STEPS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface JourneyStepsProps {
  current: number;
}

export function JourneySteps({ current }: JourneyStepsProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Langkah menuju rekomendasi">
      {JOURNEY_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.href} className="flex flex-1 items-center gap-2 last:flex-none">
            <Link
              href={step.href}
              aria-current={active ? "step" : undefined}
              className={cn("flex items-center gap-2 text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-secondary text-primary ring-4 ring-secondary",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span className={cn("hidden sm:inline", active && "inline")}>{step.label}</span>
            </Link>
            <span className={cn("h-px flex-1 bg-border", done && "bg-primary")} aria-hidden />
          </li>
        );
      })}
    </ol>
  );
}
