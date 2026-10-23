import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { PageHeader } from "@/components/layout/page-header";
import { HollandCodeSummary } from "@/features/asesmen/holland-code-summary";
import { PlansOverview } from "@/features/jalur/plans-overview";
import { RecommendationSummary } from "@/features/rekomendasi/recommendation-summary";
import { SkillSummary } from "@/features/skill/skill-summary";
import { authOptions } from "@/lib/auth-options";
import { PrimaryResources } from "./_components/primary-resources";
import { SummaryCard } from "./_components/summary-card";

export const metadata: Metadata = { title: "Beranda" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] ?? "Pengguna";

  return (
    <div className="space-y-10">
      <PageHeader title={`Halo, ${firstName}`} description="Ini ringkasan jalur karier dan progres belajarmu." />
      <PlansOverview />
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Kode Holland" href="/asesmen/hasil" linkLabel="Lihat hasil tes">
          <HollandCodeSummary />
        </SummaryCard>
        <SummaryCard title="Skill tercatat" href="/skill" linkLabel="Perbarui skill">
          <SkillSummary />
        </SummaryCard>
        <SummaryCard title="Hasil rekomendasi" href="/rekomendasi" linkLabel="Bandingkan semua">
          <RecommendationSummary />
        </SummaryCard>
      </div>
      <PrimaryResources />
    </div>
  );
}
