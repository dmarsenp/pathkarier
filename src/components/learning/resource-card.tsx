import { Award, BookOpen, ExternalLink, GraduationCap, Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LearningResource, ResourceKind } from "@/types";

const KIND_META: Record<ResourceKind, { label: string; icon: typeof BookOpen }> = {
  kursus: { label: "Kursus", icon: BookOpen },
  sertifikasi: { label: "Sertifikasi", icon: Award },
  program: { label: "Program beasiswa", icon: GraduationCap },
  materi: { label: "Materi belajar", icon: Library },
};

interface ResourceCardProps {
  resource: LearningResource;
  matched: string[];
}

export function ResourceCard({ resource, matched }: ResourceCardProps) {
  const kind = KIND_META[resource.jenis];

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
          <kind.icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug group-hover:text-primary">{resource.judul}</p>
          <p className="text-xs text-muted-foreground">
            {resource.penyedia} · {kind.label}
          </p>
        </div>
        <ExternalLink className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge
          className={cn(
            "rounded-full font-medium",
            resource.biaya === "gratis"
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
              : "bg-amber-100 text-amber-800 hover:bg-amber-100",
          )}
        >
          {resource.biaya === "gratis" ? "Gratis" : "Sebagian gratis"}
        </Badge>
        {resource.sertifikat && (
          <Badge variant="outline" className="rounded-full font-medium">
            Bersertifikat
          </Badge>
        )}
        <Badge variant="outline" className="rounded-full font-medium">
          {resource.wilayah === "indonesia" ? "Lokal Indonesia" : "Internasional"} · {resource.bahasa}
        </Badge>
      </div>
      {resource.catatan && <p className="text-xs text-muted-foreground">{resource.catatan}</p>}
      {matched.length > 0 && (
        <p className="mt-auto border-t pt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Membantu:</span> {matched.join(", ")}
        </p>
      )}
      <span className="sr-only">(membuka tab baru)</span>
    </a>
  );
}
