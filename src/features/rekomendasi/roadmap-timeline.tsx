import { Clock, ExternalLink, PlayCircle } from "lucide-react";
import { LEARNING_RESOURCES } from "@/constants/learning-resources";
import { enterStagger } from "@/lib/motion";
import { rankResources } from "@/lib/resources";
import type { RoadmapStep } from "@/types";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

export function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  return (
    <ol className="relative space-y-6 pl-8">
      {steps.map((step, index) => {
        const links = rankResources(LEARNING_RESOURCES, [step.skill], 2);
        return (
          <li key={step.urutan} className={`relative ${enterStagger(index)}`}>
            {index !== steps.length - 1 && (
              <span className="absolute -left-[2.35rem] top-8 h-[calc(100%-1rem)] w-0 border-l-2 border-dashed border-primary/30" />
            )}
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
              {(links.length > 0 || step.videoUrl) && (
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs">
                  <span className="text-muted-foreground">Belajar dari:</span>
                  {links.map(({ resource }) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      {resource.penyedia} <ExternalLink className="size-3" />
                    </a>
                  ))}
                  {step.videoUrl && (
                    <a
                      href={step.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <PlayCircle className="size-3" /> {step.videoTitle ?? "Video YouTube"}
                    </a>
                  )}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
