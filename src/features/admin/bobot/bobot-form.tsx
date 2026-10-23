"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BobotFormProps {
  initialMinat: number;
  initialSkill: number;
}

export function BobotForm({ initialMinat, initialSkill }: BobotFormProps) {
  const router = useRouter();
  const [minat, setMinat] = useState(Math.round(initialMinat * 100));
  const [skill, setSkill] = useState(Math.round(initialSkill * 100));
  const [saving, setSaving] = useState(false);

  const total = minat + skill;
  const valid = total === 100;

  const rows = useMemo(
    () => [
      { label: "Kecocokan Minat (RIASEC)", value: minat, onChange: setMinat },
      { label: "Kesiapan Skill", value: skill, onChange: setSkill },
    ],
    [minat, skill],
  );

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/bobot", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minat: minat / 100, skill: skill / 100 }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menyimpan bobot.");
      return;
    }
    toast.success("Bobot kriteria SAW diperbarui.");
    router.refresh();
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4 p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Bobot</TableHead>
              <TableHead className="w-32">Bobot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={row.value}
                      onChange={(e) => row.onChange(Number(e.target.value))}
                      className="h-9 w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-semibold">Total Bobot</TableCell>
              <TableCell className={valid ? "font-semibold" : "font-semibold text-destructive"}>{total}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {!valid && <p className="text-xs text-destructive">Total bobot harus tepat 100% sebelum disimpan.</p>}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!valid || saving}>
            {saving && <Loader2 className="animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
