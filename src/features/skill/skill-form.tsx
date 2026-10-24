"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SkillGroup } from "@/constants/careers";
import { SelectedSkillRow } from "@/features/skill/selected-skill-row";
import { SkillSearch } from "@/features/skill/skill-search";
import type { SkillLevel, UserSkill } from "@/types";

const LEVEL_GUIDE = [
  { label: "Belum", body: "Pernah dengar, belum pernah memakai." },
  { label: "Dasar", body: "Pernah dipakai di tugas, kursus, atau latihan." },
  { label: "Mahir", body: "Bisa dipakai mandiri di proyek nyata." },
];

interface SkillFormProps {
  groups: SkillGroup[];
  initial: UserSkill[];
  onSave: (skills: UserSkill[]) => Promise<void>;
}

export function SkillForm({ groups, initial, onSave }: SkillFormProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<UserSkill[]>(initial);
  const [saving, setSaving] = useState(false);

  const add = (nama: string) => setSkills((prev) => [{ nama, level: "dasar" }, ...prev]);
  const remove = (nama: string) => setSkills((prev) => prev.filter((s) => s.nama !== nama));
  const setLevel = (nama: string, level: SkillLevel) =>
    setSkills((prev) => prev.map((s) => (s.nama === nama ? { ...s, level } : s)));

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(skills);
      toast.success(`${skills.length} skill tersimpan`);
      router.push("/rekomendasi");
    } catch (error) {
      setSaving(false);
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan skill.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="h-fit rounded-2xl lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="text-lg">Tambah skill</CardTitle>
          <CardDescription>Pilih dari daftar skill yang dibutuhkan 5 peran TI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SkillSearch groups={groups} selected={skills.map((s) => s.nama)} onAdd={add} />
          <dl className="grid gap-2 rounded-xl bg-muted/60 p-4 text-sm sm:grid-cols-3">
            {LEVEL_GUIDE.map((item) => (
              <div key={item.label}>
                <dt className="font-semibold">{item.label}</dt>
                <dd className="text-xs text-muted-foreground">{item.body}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Skill dipilih ({skills.length})</h2>
          <Button onClick={handleSave} disabled={skills.length === 0} isLoading={saving} loadingText="Menyimpan...">
            Simpan & lihat rekomendasi <ArrowRight />
          </Button>
        </div>
        {skills.length === 0 ? (
          <div className="grid place-items-center gap-2 rounded-2xl border border-dashed p-10 text-center">
            <Layers className="size-8 text-muted-foreground" />
            <p className="font-medium">Belum ada skill</p>
            <p className="text-sm text-muted-foreground">Cari dan tambahkan skill yang pernah kamu pelajari.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {skills.map((skill) => (
              <SelectedSkillRow
                key={skill.nama}
                skill={skill}
                onLevelChange={(level) => setLevel(skill.nama, level)}
                onRemove={() => remove(skill.nama)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
