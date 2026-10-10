"use client";

import { Briefcase, GraduationCap, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UserStatus } from "@/types";

const STATUS_OPTIONS: { value: UserStatus; label: string; hint: string; icon: typeof GraduationCap }[] = [
  { value: "mahasiswa_akhir", label: "Mahasiswa tingkat akhir", hint: "Sedang menyusun skripsi atau magang", icon: GraduationCap },
  { value: "lulusan_baru", label: "Lulusan baru", hint: "Lulus dalam 2 tahun terakhir", icon: Briefcase },
  { value: "career_switcher", label: "Career switcher", hint: "Pindah dari bidang lain ke TI", icon: RefreshCw },
];

interface StatusPickerProps {
  value: UserStatus | "";
  onChange: (value: UserStatus) => void;
}

export function StatusPicker({ value, onChange }: StatusPickerProps) {
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as UserStatus)} className="grid gap-3 sm:grid-cols-3">
      {STATUS_OPTIONS.map((option) => (
        <Label
          key={option.value}
          htmlFor={option.value}
          className="flex cursor-pointer flex-col gap-3 rounded-xl border bg-card p-4 font-normal transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60"
        >
          <div className="flex items-center justify-between">
            <option.icon className="size-5 text-primary" />
            <RadioGroupItem id={option.value} value={option.value} />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{option.label}</p>
            <p className="text-xs text-muted-foreground">{option.hint}</p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
