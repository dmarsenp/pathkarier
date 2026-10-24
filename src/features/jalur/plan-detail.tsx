"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { useUserSkills } from "@/hooks/use-user-skills";
import { ActivityLog } from "@/features/jalur/activity-log";
import { PlanStats } from "@/features/jalur/plan-stats";
import { RemovePlanDialog } from "@/features/jalur/remove-plan-dialog";
import { RoadmapChecklist } from "@/features/jalur/roadmap-checklist";
import { planLabel, planProgress } from "@/lib/plans";
import type { Career, CareerPlan } from "@/types";

interface PlanDetailProps {
  plan: CareerPlan;
  career: Career;
  resources: React.ReactNode;
}

export function PlanDetail({ plan, career, resources }: PlanDetailProps) {
  const { setPrimary, removePlan, toggleStep, setCertificate } = useCareerPlans();
  const { skills, saveSkills } = useUserSkills();
  const [settingPrimary, setSettingPrimary] = useState(false);
  const progress = planProgress(plan);
  const skillsInProfile = new Set(skills.map((s) => s.nama));

  async function handleToggle(urutan: number) {
    const finishing = !plan.selesai[urutan];
    try {
      await toggleStep(plan.idKarier, urutan);
      if (finishing && progress.done + 1 === progress.total) toast.success(`Roadmap ${career.nama} selesai! Hebat.`);
    } catch {
      toast.error("Gagal menyimpan progres. Coba lagi.");
    }
  }

  async function handleSetPrimary() {
    setSettingPrimary(true);
    try {
      await setPrimary(plan.idKarier);
    } catch {
      toast.error("Gagal menjadikan jalur utama.");
    } finally {
      setSettingPrimary(false);
    }
  }

  async function handleSubmitCertificate(urutan: number, url: string) {
    try {
      await setCertificate(plan.idKarier, urutan, url);
      toast.success("Link sertifikat tersimpan.");
    } catch {
      toast.error("Gagal menyimpan link sertifikat.");
    }
  }

  async function handleAddSkillToProfile(skillName: string) {
    try {
      await saveSkills([...skills, { nama: skillName, level: "dasar" }]);
      toast.success(`"${skillName}" ditambahkan ke profil skill-mu sebagai Dasar.`);
    } catch {
      toast.error(`Skill "${skillName}" belum terdaftar di master data, tambahkan manual di halaman Skill.`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Badge variant={plan.prioritas === 1 ? "default" : "secondary"} className="rounded-full">
            {planLabel(plan.prioritas)}
          </Badge>
          <h2 className="text-2xl font-bold">{career.nama}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {plan.prioritas > 1 && (
            <Button variant="outline" size="sm" onClick={handleSetPrimary} isLoading={settingPrimary} loadingText="Memproses...">
              <Star /> Jadikan utama
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/rekomendasi/${career.id}`}>
              Detail karier <ArrowUpRight />
            </Link>
          </Button>
          <RemovePlanDialog
            careerName={career.nama}
            onConfirm={async () => {
              try {
                await removePlan(plan.idKarier);
              } catch {
                toast.error("Gagal menghapus jalur.");
                throw new Error("remove-plan-failed");
              }
            }}
          />
        </div>
      </div>
      <PlanStats plan={plan} progress={progress} />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2" aria-label="Roadmap belajar">
          <h3 className="font-semibold">Roadmap belajar</h3>
          <RoadmapChecklist
            plan={plan}
            onToggle={handleToggle}
            onSubmitCertificate={handleSubmitCertificate}
            onAddSkillToProfile={handleAddSkillToProfile}
            skillsInProfile={skillsInProfile}
          />
        </section>
        <ActivityLog plan={plan} />
      </div>
      <section className="space-y-3" aria-label="Kursus dan sertifikasi">
        <div>
          <h3 className="font-semibold">Kursus & sertifikasi gratis</h3>
          <p className="text-sm text-muted-foreground">Dipilih dari skill yang paling perlu kamu kejar untuk {career.nama}.</p>
        </div>
        {resources}
      </section>
    </div>
  );
}
