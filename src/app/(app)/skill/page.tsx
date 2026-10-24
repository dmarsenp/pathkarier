import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SkillFormContainer } from "@/features/skill/skill-form-container";
import { getSkillGroupsFromDb } from "@/lib/skills";

export const metadata: Metadata = { title: "Skill" };

export default async function SkillPage() {
  const groups = await getSkillGroupsFromDb();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Skill"
        title="Skill apa yang sudah kamu kuasai?"
        description="Pilih skill lalu tentukan levelnya dengan jujur. Skill yang tidak dipilih dianggap belum dikuasai. Perubahan langsung memperbarui rekomendasi kariermu."
      />
      <SkillFormContainer groups={groups} />
    </div>
  );
}
