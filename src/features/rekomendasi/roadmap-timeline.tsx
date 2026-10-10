import { Clock } from "lucide-react";
import type { RoadmapStep } from "@/types";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

export function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l-2 border-dashed border-primary/30 pl-8">
      {steps.map((step) => (
        <li key={step.urutan} className="relative">
          <span className="absolute -left-[2.85rem] grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-card">
            {step.urutan}
          </span>
          <div className="space-y-1.5 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{step.skill}</p>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                <Clock className="size-3" /> {step.estimasiMinggu} minggu
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{step.aktivitas}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
