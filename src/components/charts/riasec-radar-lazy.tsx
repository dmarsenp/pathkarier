"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function RadarSkeleton() {
  return <Skeleton className="mx-auto aspect-square w-full max-w-sm rounded-xl" />;
}

// Recharts cukup besar, jadi grafik dimuat terpisah agar halaman lain tidak ikut menanggung ukurannya.
export const RiasecRadarLazy = dynamic(() => import("@/components/charts/riasec-radar").then((mod) => mod.RiasecRadar), {
  ssr: false,
  loading: RadarSkeleton,
});
