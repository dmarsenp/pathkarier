import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecommendationBlocker } from "@/hooks/use-recommendations";

const COPY: Record<RecommendationBlocker, { title: string; desc: string; href: string; label: string }> = {
  "no-assessment": {
    title: "Kerjakan tes minat dulu",
    desc: "Rekomendasi karier butuh hasil tes minat (RIASEC) kamu.",
    href: "/asesmen/pengantar",
    label: "Mulai tes minat",
  },
  "no-skill": {
    title: "Lengkapi skill dulu",
    desc: "Rekomendasi karier butuh data skill yang sudah kamu kuasai.",
    href: "/skill",
    label: "Isi skill",
  },
};

// UC-05 skenario exception: arahkan pengguna melengkapi data sebelum melihat rekomendasi.
export function RecommendationBlockerCard({ reason }: { reason: RecommendationBlocker }) {
  const copy = COPY[reason];
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-10 text-center">
      <Compass className="size-8 text-primary" />
      <p className="text-lg font-semibold">{copy.title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{copy.desc}</p>
      <Button asChild>
        <Link href={copy.href}>{copy.label}</Link>
      </Button>
    </div>
  );
}
