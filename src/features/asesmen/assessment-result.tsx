"use client";

import Link from "next/link";
import { ArrowRight, Compass, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RiasecRadarLazy } from "@/components/charts/riasec-radar-lazy";
import { PageHeader } from "@/components/layout/page-header";
import { RIASEC_META, RIASEC_ORDER } from "@/constants/riasec";
import { HollandCodeCard } from "@/features/asesmen/holland-code-card";
import { ScoreSummaryCard } from "@/features/asesmen/score-summary-card";
import { useAssessment } from "@/hooks/use-assessment";
import { topCode } from "@/lib/engine/riasec";

function formatTanggalPanjang(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function AssessmentResult() {
  const { result, ready } = useAssessment();

  if (!ready) return <Skeleton className="h-96 w-full rounded-2xl" />;

  if (!result) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-10 text-center">
          <Compass className="size-8 text-primary" />
          <p className="text-lg font-semibold">Kamu belum pernah mengerjakan tes minat</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Kerjakan tes minat RIASEC untuk melihat profil minat kerjamu di sini.
          </p>
          <Button asChild>
            <Link href="/asesmen/pengantar">
              Mulai tes minat <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const code = topCode(result.scores);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Tes selesai · ${formatTanggalPanjang(result.selesaiPada)}`}
        title="Ini profil minat kerjamu"
        description={`Kamu paling condong ke tipe ${code.map((d) => RIASEC_META[d].nama).join(", ")}.`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/asesmen">Ulangi tes</Link>
            </Button>
            <Button asChild>
              <Link href="/skill">
                Lanjut isi skill <ArrowRight />
              </Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Peta minat</CardTitle>
            <CardDescription>Semakin jauh dari pusat, semakin kuat minatmu.</CardDescription>
          </CardHeader>
          <CardContent>
            <RiasecRadarLazy
              labels={RIASEC_ORDER.map((d) => RIASEC_META[d].nama)}
              values={RIASEC_ORDER.map((d) => result.scores[d])}
              config={{ max: 5, seriesLabel: "Skor" }}
            />
          </CardContent>
        </Card>
        <div className="space-y-6 lg:col-span-3">
          <HollandCodeCard code={code} />
          <ScoreSummaryCard scores={result.scores} />
        </div>
      </div>
      <Alert className="rounded-xl border-primary/20 bg-secondary/50">
        <Info className="size-4" />
        <AlertDescription>
          Gunakan hasil ini sebagai bahan refleksi, bukan batasan. Minat bisa berubah seiring pengalamanmu.
        </AlertDescription>
      </Alert>
    </div>
  );
}
