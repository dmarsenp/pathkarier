"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RIASEC_ORDER } from "@/constants/riasec";
import type { RiasecDim } from "@/types";

export interface KarierFormValues {
  id?: string;
  nama: string;
  ringkas: string;
  deskripsi: string;
  tanggungJawab: string[];
  profilR: number;
  profilI: number;
  profilA: number;
  profilS: number;
  profilE: number;
  profilC: number;
}

interface KarierFormDialogProps {
  mode: "create" | "edit";
  initial?: KarierFormValues;
}

const EMPTY: KarierFormValues = {
  nama: "",
  ringkas: "",
  deskripsi: "",
  tanggungJawab: [],
  profilR: 1,
  profilI: 1,
  profilA: 1,
  profilS: 1,
  profilE: 1,
  profilC: 1,
};

export function KarierFormDialog({ mode, initial }: KarierFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const values = initial ?? EMPTY;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      nama: form.get("nama"),
      ringkas: form.get("ringkas"),
      deskripsi: form.get("deskripsi"),
      tanggungJawab: String(form.get("tanggungJawab") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      profilR: form.get("profilR"),
      profilI: form.get("profilI"),
      profilA: form.get("profilA"),
      profilS: form.get("profilS"),
      profilE: form.get("profilE"),
      profilC: form.get("profilC"),
    };

    setSaving(true);
    const url = mode === "create" ? "/api/admin/karier" : `/api/admin/karier/${values.id}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menyimpan karier.");
      return;
    }
    toast.success(mode === "create" ? "Karier ditambahkan." : "Karier diperbarui.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus /> Tambah Karier
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Tambah Karier" : "Edit Karier"}</DialogTitle>
          <DialogDescription>
            Profil RIASEC diisi angka 0-7 per dimensi (mengikuti data O*NET) — dipakai untuk hitung kecocokan minat (cosine
            similarity).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField id="nama" label="Nama Karier">
            <Input id="nama" name="nama" defaultValue={values.nama} required />
          </FormField>
          <FormField id="ringkas" label="Profil Singkat" hint="Satu kalimat ringkas, tampil di kartu rekomendasi.">
            <Input id="ringkas" name="ringkas" defaultValue={values.ringkas} required />
          </FormField>
          <FormField id="deskripsi" label="Deskripsi lengkap">
            <Textarea id="deskripsi" name="deskripsi" defaultValue={values.deskripsi} rows={3} required />
          </FormField>
          <FormField id="tanggungJawab" label="Tanggung jawab utama" hint="Satu poin per baris.">
            <Textarea
              id="tanggungJawab"
              name="tanggungJawab"
              defaultValue={values.tanggungJawab.join("\n")}
              rows={4}
              required
            />
          </FormField>
          <div className="space-y-2">
            <p className="text-sm font-medium">Profil RIASEC</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {RIASEC_ORDER.map((dim: RiasecDim) => (
                <FormField key={dim} id={`profil${dim}`} label={dim}>
                  <Input
                    id={`profil${dim}`}
                    name={`profil${dim}`}
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    defaultValue={values[`profil${dim}` as keyof KarierFormValues] as number}
                    required
                  />
                </FormField>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Tambah Karier" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
