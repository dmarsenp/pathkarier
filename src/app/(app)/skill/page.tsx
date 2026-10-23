import type { Metadata } from "next";
import { JourneySteps } from "@/components/layout/journey-steps";
import { PageHeader } from "@/components/layout/page-header";
import { SkillFormContainer } from "@/features/skill/skill-form-container";
import { getSkillGroupsFromDb } from "@/lib/skills";

export const metadata: Metadata = { title: "Skill" };

export default async function SkillPage() {
  const groups = await getSkillGroupsFromDb();
  return (
    <div className="space-y-8">
      <JourneySteps current={2} />
      <PageHeader
        eyebrow="Langkah 3 dari 4"
        title="Skill apa yang sudah kamu kuasai?"
        description="Pilih skill lalu tentukan levelnya dengan jujur. Skill yang tidak dipilih dianggap belum dikuasai."
      />
      <SkillFormContainer groups={groups} />
    </div>
  );
}
