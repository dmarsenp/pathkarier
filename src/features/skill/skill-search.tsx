"use client";

import { Plus } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { SkillGroup } from "@/constants/careers";

interface SkillSearchProps {
  groups: SkillGroup[];
  selected: string[];
  onAdd: (nama: string) => void;
}

export function SkillSearch({ groups, selected, onAdd }: SkillSearchProps) {
  return (
    <Command className="rounded-xl border">
      <CommandInput placeholder="Cari skill, mis. SQL, Figma, JavaScript…" className="h-12" />
      <CommandList className="max-h-80">
        <CommandEmpty>Skill tidak ditemukan. Hanya skill dari daftar yang bisa dipilih.</CommandEmpty>
        {groups.map((group) => {
          const available = group.skills.filter((nama) => !selected.includes(nama));
          if (available.length === 0) return null;
          return (
            <CommandGroup key={group.karier} heading={group.karier}>
              {available.map((nama) => (
                <CommandItem key={nama} value={nama} onSelect={() => onAdd(nama)} className="justify-between py-2.5">
                  {nama}
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Plus className="size-3.5" /> Tambah
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </Command>
  );
}
