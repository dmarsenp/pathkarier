"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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
}

export function ProfileForm({ nama, email }: ProfileFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<UserStatus | "">("");

  // TODO: PUT /api/profil (FR-03), validasi sisi server.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              <Select name="pendidikan">
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
              <Select name="tahun">
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
            <Input id="jurusan" name="jurusan" placeholder="Contoh: Sistem Informasi" className="h-11" />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!status}>
              Simpan dan lanjut <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
