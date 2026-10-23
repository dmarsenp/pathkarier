"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RIASEC_META, RIASEC_ORDER } from "@/constants/riasec";
import type { RiasecDim } from "@/types";

interface SoalFormDialogProps {
  mode: "create" | "edit";
  id?: number;
  initial?: { teks: string; dimensi: RiasecDim; aktif: boolean };
}

export function SoalFormDialog({ mode, id, initial }: SoalFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dimensi, setDimensi] = useState<RiasecDim | "">(initial?.dimensi ?? "");
  const [aktif, setAktif] = useState(initial?.aktif ?? true);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = { teks: form.get("teks"), dimensi, aktif };

    setSaving(true);
    const url = mode === "create" ? "/api/admin/soal" : `/api/admin/soal/${id}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menyimpan soal.");
      return;
    }
    toast.success(mode === "create" ? "Soal ditambahkan." : "Soal diperbarui.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus /> Tambah Soal
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Tambah Soal" : "Edit Soal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField id="teks" label="Pernyataan">
            <Textarea id="teks" name="teks" defaultValue={initial?.teks} rows={3} required />
          </FormField>
          <FormField id="dimensi" label="Dimensi RIASEC">
            <Select value={dimensi} onValueChange={(v) => setDimensi(v as RiasecDim)}>
              <SelectTrigger id="dimensi">
                <SelectValue placeholder="Pilih dimensi" />
              </SelectTrigger>
              <SelectContent>
                {RIASEC_ORDER.map((dim) => (
                  <SelectItem key={dim} value={dim}>
                    {dim} — {RIASEC_META[dim].nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          {mode === "edit" && (
            <div className="flex items-center gap-2">
              <Checkbox id="aktif" checked={aktif} onCheckedChange={(v) => setAktif(v === true)} />
              <Label htmlFor="aktif" className="font-normal">
                Aktif (dipakai pada asesmen berikutnya)
              </Label>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving || !dimensi}>
              {saving && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Tambah Soal" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
