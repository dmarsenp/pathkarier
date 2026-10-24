"use client";

import { Clock, ExternalLink, PlayCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LEARNING_RESOURCES } from "@/constants/learning-resources";
import { CertificateProofField } from "@/features/jalur/certificate-proof-field";
import { formatTanggal } from "@/lib/plans";
import { rankResources } from "@/lib/resources";
import { cn } from "@/lib/utils";
import type { CareerPlan } from "@/types";

interface RoadmapChecklistProps {
  plan: CareerPlan;
  onToggle: (urutan: number) => void;
  onSubmitCertificate?: (urutan: number, url: string) => void;
  onAddSkillToProfile?: (skillName: string) => void;
  skillsInProfile?: Set<string>;
}

export function RoadmapChecklist({
  plan,
  onToggle,
  onSubmitCertificate,
  onAddSkillToProfile,
  skillsInProfile,
}: RoadmapChecklistProps) {
  return (
    <ol className="space-y-3">
      {plan.roadmap.map((step) => {
        const doneAt = plan.selesai[step.urutan];
        const id = `step-${plan.idKarier}-${step.urutan}`;
        const links = rankResources(LEARNING_RESOURCES, [step.skill], 2);
        return (
          <li
            key={step.urutan}
            className={cn("flex gap-4 rounded-xl border bg-card p-4 transition-colors", doneAt && "border-primary/30 bg-secondary/40")}
          >
            <Checkbox id={id} checked={Boolean(doneAt)} onCheckedChange={() => onToggle(step.urutan)} className="mt-1 size-5" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={id} className={cn("cursor-pointer font-semibold", doneAt && "text-muted-foreground line-through")}>
                  {step.urutan}. {step.skill}
                </label>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {doneAt ? `Selesai ${formatTanggal(doneAt)}` : `± ${step.estimasiMinggu} minggu`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{step.aktivitas}</p>
              {!doneAt && (links.length > 0 || step.videoUrl) && (
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
              {onSubmitCertificate && (
                <CertificateProofField
                  certificateUrl={step.sertifikatUrl ?? null}
                  onSubmitCertificate={(url) => onSubmitCertificate(step.urutan, url)}
                />
              )}
              {doneAt && onAddSkillToProfile && !skillsInProfile?.has(step.skill) && (
                <Button size="sm" variant="outline" className="h-7 rounded-full text-xs" onClick={() => onAddSkillToProfile(step.skill)}>
                  <Plus className="size-3" /> Tambahkan &quot;{step.skill}&quot; ke profil skill
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
