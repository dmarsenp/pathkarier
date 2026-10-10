"use client";

import { useState } from "react";
import { FolderGit2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoadmapLoading } from "@/features/rekomendasi/roadmap-loading";
import { RoadmapTimeline } from "@/features/rekomendasi/roadmap-timeline";
import type { AiRoadmap } from "@/types";

type PanelState = "idle" | "loading" | "done";

interface RoadmapPanelProps {
  careerName: string;
  roadmap: AiRoadmap;
  saveAction?: React.ReactNode;
}

export function RoadmapPanel({ careerName, roadmap, saveAction }: RoadmapPanelProps) {
  const [state, setState] = useState<PanelState>("idle");

  // TODO: POST /api/rekomendasi/{idKarier}/roadmap. Bila gagal, tampilkan fallback (SPEC 7.6).
  function generate() {
    setState("loading");
    setTimeout(() => setState("done"), 2400);
  }

  return (
    <Card id="roadmap" className="scroll-mt-24 overflow-hidden rounded-2xl">
      <CardHeader className="border-b bg-gradient-to-r from-secondary/80 to-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <div className="space-y-1">
              <CardTitle className="text-lg">Roadmap belajar dengan AI</CardTitle>
              <CardDescription>Penjelasan dan langkah belajar menuju {careerName}. AI tidak mengubah peringkat.</CardDescription>
            </div>
          </div>
          {state === "done" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={generate}>
                <RefreshCw /> Buat ulang
              </Button>
              {saveAction}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {state === "idle" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="max-w-md text-sm text-muted-foreground">
              AI akan menyusun urutan belajar dari skill prioritasmu, lengkap dengan estimasi waktu dan ide proyek portofolio.
            </p>
            <Button size="lg" onClick={generate}>
              <Sparkles /> Buat roadmap
            </Button>
          </div>
        )}
        {state === "loading" && <RoadmapLoading />}
        {state === "done" && (
          <div className="space-y-8">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {roadmap.penjelasan.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <RoadmapTimeline steps={roadmap.roadmap} />
            <div className="space-y-3">
              <h3 className="font-semibold">Ide proyek portofolio</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {roadmap.proyekPortofolio.map((project) => (
                  <li key={project.judul} className="flex gap-3 rounded-xl border bg-muted/40 p-4">
                    <FolderGit2 className="size-5 shrink-0 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{project.judul}</p>
                      <p className="text-xs text-muted-foreground">{project.skillTerkait.join(" · ")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">Dibuat dengan bantuan AI. Periksa kembali dan sesuaikan dengan kondisimu.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
