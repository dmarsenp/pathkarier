"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { ResourceCard } from "@/components/learning/resource-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RankedResource } from "@/lib/resources";
import type { ResourceRegion } from "@/types";

type RegionFilter = ResourceRegion | "semua";

const REGION_OPTIONS: { value: RegionFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "indonesia", label: "Lokal Indonesia" },
  { value: "internasional", label: "Internasional" },
];

interface ResourceExplorerProps {
  items: RankedResource[];
  limit?: number;
}

export function ResourceExplorer({ items, limit = 6 }: ResourceExplorerProps) {
  const [region, setRegion] = useState<RegionFilter>("semua");
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  const visible = items
    .filter(({ resource }) => region === "semua" || resource.wilayah === region)
    .filter(({ resource }) => !certifiedOnly || resource.sertifikat)
    .slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          value={region}
          onValueChange={(v) => v && setRegion(v as RegionFilter)}
          className="justify-start rounded-lg bg-muted p-1"
          aria-label="Filter wilayah"
        >
          {REGION_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              size="sm"
              className="h-8 rounded-md px-3 text-xs data-[state=on]:bg-card data-[state=on]:shadow-sm"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2">
          <Checkbox id="certified" checked={certifiedOnly} onCheckedChange={(v) => setCertifiedOnly(v === true)} />
          <Label htmlFor="certified" className="text-sm font-normal">
            Hanya yang bersertifikat
          </Label>
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <SearchX className="size-6" />
          Belum ada sumber belajar yang cocok dengan filter ini.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ resource, matched }) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} matched={matched} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
