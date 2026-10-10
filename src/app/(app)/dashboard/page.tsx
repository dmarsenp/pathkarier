import type { Metadata } from "next";
import Link from "next/link";
import { RiasecChip } from "@/components/ui/riasec-chip";
import { PageHeader } from "@/components/layout/page-header";
import { CAREERS, getCareer } from "@/constants/careers";
import { MOCK_ASSESSMENT_DATE, MOCK_RECOMMENDATIONS, MOCK_RIASEC, MOCK_USER, MOCK_USER_SKILLS } from "@/constants/mock";
import { RIASEC_META } from "@/constants/riasec";
import { PlansOverview } from "@/features/jalur/plans-overview";
import { ResourceExplorer } from "@/features/sumber-belajar/resource-explorer";
import { topCode } from "@/lib/engine/riasec";
import { toPercent } from "@/lib/format";
import { resourcesForCareer } from "@/lib/resources";
import { PrimaryResources } from "./_components/primary-resources";
import { SummaryCard } from "./_components/summary-card";

export const metadata: Metadata = { title: "Beranda" };

export default function DashboardPage() {
  const code = topCode(MOCK_RIASEC);
  const mahir = MOCK_USER_SKILLS.filter((s) => s.level === "mahir").length;
  const dasar = MOCK_USER_SKILLS.filter((s) => s.level === "dasar").length;
  const resourcesByCareer = Object.fromEntries(
    CAREERS.map((career) => [career.id, <ResourceExplorer key={career.id} items={resourcesForCareer(career, MOCK_USER_SKILLS)} />]),
  );

  return (
    <div className="space-y-10">
      <PageHeader title={`Halo, ${MOCK_USER.nama.split(" ")[0]}`} description="Ini ringkasan jalur karier dan progres belajarmu." />
      <PlansOverview />
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Kode Holland" href="/asesmen/hasil" linkLabel="Lihat hasil tes">
          <div className="flex gap-2">
            {code.map((dim) => (
              <RiasecChip key={dim} dim={dim} size="lg" />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {code.map((d) => RIASEC_META[d].nama).join(" · ")}
            <span className="block text-xs">Tes terakhir {MOCK_ASSESSMENT_DATE}</span>
          </p>
        </SummaryCard>
        <SummaryCard title="Skill tercatat" href="/skill" linkLabel="Perbarui skill">
          <p className="text-4xl font-extrabold">{MOCK_USER_SKILLS.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {mahir} mahir · {dasar} dasar
          </p>
        </SummaryCard>
        <SummaryCard title="Hasil rekomendasi" href="/rekomendasi" linkLabel="Bandingkan semua">
          <ol className="space-y-2">
            {MOCK_RECOMMENDATIONS.map((result) => (
              <li key={result.idKarier}>
                <Link href={`/rekomendasi/${result.idKarier}`} className="flex items-center justify-between gap-2 text-sm hover:text-primary">
                  <span className="truncate">
                    <span className="mr-2 text-muted-foreground">#{result.peringkat}</span>
                    {getCareer(result.idKarier)?.nama}
                  </span>
                  <span className="font-semibold tabular-nums">{toPercent(result.skorSaw)}%</span>
                </Link>
              </li>
            ))}
          </ol>
        </SummaryCard>
      </div>
      <PrimaryResources fallbackId={MOCK_RECOMMENDATIONS[0].idKarier} resourcesByCareer={resourcesByCareer} />
    </div>
  );
}
