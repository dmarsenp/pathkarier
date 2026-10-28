"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { SkillLevel, UserSkill } from "@/types";

const LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "belum", label: "Belum" },
  { value: "dasar", label: "Dasar" },
  { value: "mahir", label: "Mahir" },
];

interface SelectedSkillRowProps {
  skill: UserSkill;
  onLevelChange: (level: SkillLevel) => void;
  onRemove: () => void;
}

export function SelectedSkillRow({ skill, onLevelChange, onRemove }: SelectedSkillRowProps) {
  return (
    <li className="flex animate-in flex-col gap-3 rounded-xl border bg-card p-3 pl-4 duration-300 fade-in slide-in-from-top-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">{skill.nama}</p>
      <div className="flex items-center justify-between gap-2">
        <ToggleGroup
          type="single"
          value={skill.level}
          onValueChange={(v) => v && onLevelChange(v as SkillLevel)}
          className="rounded-lg bg-muted p-1"
          aria-label={`Level ${skill.nama}`}
        >
          {LEVELS.map((level) => (
            <ToggleGroupItem
              key={level.value}
              value={level.value}
              size="sm"
              className="h-7 rounded-md px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {level.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={onRemove} aria-label={`Hapus ${skill.nama}`}>
          <X />
        </Button>
      </div>
    </li>
  );
}
