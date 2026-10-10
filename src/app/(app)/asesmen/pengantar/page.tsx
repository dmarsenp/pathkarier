import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, ListChecks, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RiasecChip } from "@/components/ui/riasec-chip";
import { JourneySteps } from "@/components/layout/journey-steps";
import { PageHeader } from "@/components/layout/page-header";
import { RIASEC_META, RIASEC_ORDER } from "@/constants/riasec";

export const metadata: Metadata = { title: "Tes minat RIASEC" };

const TIPS = [
  { icon: Clock, title: "8–10 menit", body: "30 pernyataan, dibagi ke 6 halaman." },
  { icon: MessageCircleHeart, title: "Jawab spontan", body: "Tidak ada jawaban benar atau salah." },
  { icon: ListChecks, title: "Bisa dilanjutkan", body: "Jawabanmu tersimpan sebagai draf." },
];

export default function AsesmenPengantarPage() {
  return (
    <div className="space-y-8">
      <JourneySteps current={1} />
      <PageHeader
        eyebrow="Langkah 2 dari 4 · Tes minat RIASEC"
        title="Kenali 6 tipe minat kerjamu"
        description="Model Holland (RIASEC) memetakan minat ke enam tipe. Kebanyakan orang punya campuran beberapa tipe, dan tiga yang paling kuat menjadi kode Holland-mu."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RIASEC_ORDER.map((dim) => (
          <Card key={dim} className="rounded-xl">
            <CardContent className="flex gap-4 p-4">
              <RiasecChip dim={dim} />
              <div>
                <p className="font-semibold">{RIASEC_META[dim].nama}</p>
                <p className="text-sm text-muted-foreground">{RIASEC_META[dim].ringkas}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden rounded-2xl border-primary/20 bg-gradient-to-r from-secondary to-card">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <ul className="grid gap-4 sm:grid-cols-3 lg:gap-8">
            {TIPS.map((tip) => (
              <li key={tip.title} className="flex gap-3">
                <tip.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="shrink-0 rounded-full px-6">
            <Link href="/asesmen">
              Mulai tes <ArrowRight />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
