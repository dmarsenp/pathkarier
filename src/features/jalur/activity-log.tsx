import Link from "next/link";
import { History, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTanggal } from "@/lib/plans";
import type { CareerPlan } from "@/types";

interface ActivityLogProps {
  plan: CareerPlan;
}

export function ActivityLog({ plan }: ActivityLogProps) {
  const entries = plan.roadmap
    .filter((step) => plan.selesai[step.urutan])
    .map((step) => ({ skill: step.skill, tanggal: plan.selesai[step.urutan] }))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="size-4 text-primary" /> Riwayat perkembangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada langkah selesai. Centang langkah di roadmap saat kamu menuntaskannya.</p>
          ) : (
            <ol className="space-y-3 border-l pl-4">
              {entries.map((entry) => (
                <li key={entry.skill} className="relative text-sm">
                  <span className="absolute -left-[1.3rem] top-1.5 size-2 rounded-full bg-primary" aria-hidden />
                  <p className="font-medium">{entry.skill}</p>
                  <p className="text-xs text-muted-foreground">Selesai {formatTanggal(entry.tanggal)}</p>
                </li>
              ))}
              <li className="relative text-sm">
                <span className="absolute -left-[1.3rem] top-1.5 size-2 rounded-full bg-muted-foreground/40" aria-hidden />
                <p className="text-muted-foreground">Jalur disimpan {formatTanggal(plan.disimpanPada)}</p>
              </li>
            </ol>
          )}
        </CardContent>
      </Card>
      <div className="rounded-2xl bg-secondary/70 p-5 text-sm">
        <TrendingUp className="mb-2 size-5 text-primary" />
        <p className="font-semibold">Skill-mu bertambah?</p>
        <p className="mt-1 text-muted-foreground">
          Perbarui levelnya di halaman Skill agar skor kecocokan dan rekomendasimu ikut diperbarui.
        </p>
        <Link href="/skill" className="mt-2 inline-block font-semibold text-primary hover:underline">
          Perbarui skill
        </Link>
      </div>
    </div>
  );
}
