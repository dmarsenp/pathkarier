"use client";

import Link from "next/link";
import { RiasecChip } from "@/components/ui/riasec-chip";
import { RIASEC_META } from "@/constants/riasec";
import { useAssessment } from "@/hooks/use-assessment";
import { topCode } from "@/lib/engine/riasec";

function formatTanggalPanjang(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function HollandCodeSummary() {
  const { result, ready } = useAssessment();
  if (!ready) return null;

  if (!result) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum pernah tes.{" "}
        <Link href="/asesmen/pengantar" className="font-medium text-primary hover:underline">
          Mulai tes minat
        </Link>
      </p>
    );
  }

  const code = topCode(result.scores);

  return (
    <>
      <div className="flex gap-2">
        {code.map((dim) => (
          <RiasecChip key={dim} dim={dim} size="lg" />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {code.map((d) => RIASEC_META[d].nama).join(" · ")}
        <span className="block text-xs">Tes terakhir {formatTanggalPanjang(result.selesaiPada)}</span>
      </p>
    </>
  );
}
