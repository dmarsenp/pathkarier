import type { Metadata } from "next";
import { JourneySteps } from "@/components/layout/journey-steps";
import { PageHeader } from "@/components/layout/page-header";
import { getSkillGroups } from "@/constants/careers";
import { MOCK_USER_SKILLS } from "@/constants/mock";
import { SkillForm } from "@/features/skill/skill-form";

export const metadata: Metadata = { title: "Skill" };

export default function SkillPage() {
  // TODO: ambil master skill (GET /api/skill/master) dan skill pengguna (GET /api/skill).
  return (
    <div className="space-y-8">
      <JourneySteps current={2} />
      <PageHeader
        eyebrow="Langkah 3 dari 4"
        title="Skill apa yang sudah kamu kuasai?"
        description="Pilih skill lalu tentukan levelnya dengan jujur. Skill yang tidak dipilih dianggap belum dikuasai."
      />
      <SkillForm groups={getSkillGroups()} initial={MOCK_USER_SKILLS} />
    </div>
  );
}
