"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StatusPicker } from "@/features/profil/status-picker";
import type { UserStatus } from "@/types";

const EDUCATION = ["SMA/SMK", "D3", "D4/S1", "S2"];
const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 12 }, (_, i) => String(CURRENT_YEAR + 2 - i));

interface ProfileFormProps {
  nama: string;
  email: string;
  status?: UserStatus;
  pendidikan?: string;
  jurusan?: string;
  tahunLulus?: number;
}

export function ProfileForm({ nama, email, status: initialStatus, pendidikan, jurusan, tahunLulus }: ProfileFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<UserStatus | "">(initialStatus ?? "");
  const [saving, setSaving] = useState(false);

  // FR-03: pengguna melihat dan memperbarui data profil dasar.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    const res = await fetch("/api/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("nama"),
        status,
        pendidikan: form.get("pendidikan"),
        jurusan: form.get("jurusan"),
        tahunLulus: form.get("tahun"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      toast.error(data.error ?? "Gagal menyimpan profil.");
      return;
    }
    toast.success("Profil tersimpan");
    router.push("/asesmen/pengantar");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Data diri</CardTitle>
          <CardDescription>Nama dan email diambil dari akunmu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="nama" label="Nama lengkap">
              <Input id="nama" name="nama" defaultValue={nama} required className="h-11" />
            </FormField>
            <FormField id="email" label="Email" hint="Email tidak dapat diubah.">
              <Input id="email" value={email} disabled className="h-11" />
            </FormField>
          </div>
          <Separator />
          <div className="space-y-3">
            <p className="text-sm font-medium">Status saat ini</p>
            <StatusPicker value={status} onChange={setStatus} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="pendidikan" label="Pendidikan terakhir">
              <Select name="pendidikan" defaultValue={pendidikan}>
                <SelectTrigger id="pendidikan" className="h-11">
                  <SelectValue placeholder="Pilih jenjang" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="tahun" label="Tahun lulus" hint="Perkiraan, bila belum lulus.">
              <Select name="tahun" defaultValue={tahunLulus ? String(tahunLulus) : undefined}>
                <SelectTrigger id="tahun" className="h-11">
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField id="jurusan" label="Jurusan">
            <Input id="jurusan" name="jurusan" defaultValue={jurusan} placeholder="Contoh: Sistem Informasi" className="h-11" />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!status || saving}>
              {saving && <Loader2 className="animate-spin" />}
              Simpan dan lanjut <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
