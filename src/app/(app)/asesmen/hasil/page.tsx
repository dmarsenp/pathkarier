import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiasecRadar } from "@/components/charts/riasec-radar";
import { JourneySteps } from "@/components/layout/journey-steps";
import { PageHeader } from "@/components/layout/page-header";
import { MOCK_ASSESSMENT_DATE, MOCK_RIASEC } from "@/constants/mock";
import { RIASEC_META, RIASEC_ORDER } from "@/constants/riasec";
import { HollandCodeCard } from "@/features/asesmen/holland-code-card";
import { ScoreSummaryCard } from "@/features/asesmen/score-summary-card";
import { topCode } from "@/lib/engine/riasec";

export const metadata: Metadata = { title: "Hasil tes minat" };

export default function AsesmenHasilPage() {
  // TODO: ambil asesmen `selesai` terbaru dari server (FR-05).
  const scores = MOCK_RIASEC;
  const code = topCode(scores);

  return (
    <div className="space-y-8">
      <JourneySteps current={1} />
      <PageHeader
        eyebrow={`Tes selesai · ${MOCK_ASSESSMENT_DATE}`}
        title="Ini profil minat kerjamu"
        description={`Kamu paling condong ke tipe ${code.map((d) => RIASEC_META[d].nama).join(", ")}.`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/asesmen">
                <RotateCcw /> Ulangi tes
              </Link>
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
            <RiasecRadar
              labels={RIASEC_ORDER.map((d) => RIASEC_META[d].nama)}
              values={RIASEC_ORDER.map((d) => scores[d])}
              config={{ max: 5, seriesLabel: "Skor" }}
            />
          </CardContent>
        </Card>
        <div className="space-y-6 lg:col-span-3">
          <HollandCodeCard code={code} />
          <ScoreSummaryCard scores={scores} />
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
