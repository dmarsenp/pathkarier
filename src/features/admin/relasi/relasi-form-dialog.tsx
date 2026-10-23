"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  id: string;
  nama: string;
}

interface RelasiFormDialogProps {
  mode: "create" | "edit";
  careers: Option[];
  skills: Option[];
  initial?: { careerId: string; careerNama: string; skillId: string; skillNama: string; bobot: number };
}

export function RelasiFormDialog({ mode, careers, skills, initial }: RelasiFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [careerId, setCareerId] = useState(initial?.careerId ?? "");
  const [skillId, setSkillId] = useState(initial?.skillId ?? "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = { careerId, skillId, bobot: form.get("bobot") };

    setSaving(true);
    const res = await fetch("/api/admin/relasi-skill-karier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menyimpan relasi.");
      return;
    }
    toast.success(mode === "create" ? "Relasi ditambahkan." : "Bobot diperbarui.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus /> Tambah Relasi
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Tambah Relasi Skill-Karier" : "Edit Bobot Relasi"}</DialogTitle>
          <DialogDescription>Bobot menentukan seberapa besar pengaruh skill ini pada skor kesiapan karier (0-5).</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField id="career" label="Karier">
            <Select value={careerId} onValueChange={setCareerId} disabled={mode === "edit"}>
              <SelectTrigger id="career">
                <SelectValue placeholder="Pilih karier" />
              </SelectTrigger>
              <SelectContent>
                {careers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField id="skill" label="Skill">
            <Select value={skillId} onValueChange={setSkillId} disabled={mode === "edit"}>
              <SelectTrigger id="skill">
                <SelectValue placeholder="Pilih skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField id="bobot" label="Bobot">
            <Input id="bobot" name="bobot" type="number" min={0.1} max={5} step={0.01} defaultValue={initial?.bobot ?? 2.5} required />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving || !careerId || !skillId}>
              {saving && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Tambah Relasi" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
