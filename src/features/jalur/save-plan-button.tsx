"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookmarkPlus, Check, ChevronDown, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { MAX_PLANS, planLabel } from "@/lib/plans";
import type { CareerId, RoadmapStep } from "@/types";

interface SavePlanButtonProps {
  idKarier: CareerId;
  careerName: string;
  skorSaw: number;
  roadmap: RoadmapStep[];
}

export function SavePlanButton({ idKarier, careerName, skorSaw, roadmap }: SavePlanButtonProps) {
  const router = useRouter();
  const { ready, canAdd, plans, getPlan, savePlan, setPrimary } = useCareerPlans();
  const plan = getPlan(idKarier);

  if (!ready) return <Skeleton className="h-10 w-44 rounded-md" />;

  function save(asPrimary: boolean) {
    savePlan({ idKarier, skorSaw, roadmap }, asPrimary);
    toast.success(`${careerName} disimpan sebagai ${asPrimary ? "jalur utama" : "jalur alternatif"}`, {
      action: { label: "Pantau progres", onClick: () => router.push(`/jalur?karier=${idKarier}`) },
    });
  }

  if (plan) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link href={`/jalur?karier=${idKarier}`}>
            <Check /> {planLabel(plan.prioritas)} · pantau progres
          </Link>
        </Button>
        {plan.prioritas > 1 && (
          <Button variant="outline" onClick={() => setPrimary(idKarier)}>
            <Star /> Jadikan utama
          </Button>
        )}
      </div>
    );
  }

  if (!canAdd) {
    return (
      <Button variant="outline" disabled title={`Kamu sudah punya ${MAX_PLANS} jalur. Hapus salah satu untuk menambah.`}>
        Maksimal {MAX_PLANS} jalur tersimpan
      </Button>
    );
  }

  if (plans.length === 0) {
    return (
      <Button onClick={() => save(true)}>
        <BookmarkPlus /> Pilih sebagai jalur utama
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <BookmarkPlus /> Simpan ke jalurku <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Kamu bisa menekuni hingga {MAX_PLANS} jalur sekaligus.
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => save(true)}>
          <Star /> Jadikan jalur utama
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => save(false)}>
          <BookmarkPlus /> Tambah sebagai alternatif
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
