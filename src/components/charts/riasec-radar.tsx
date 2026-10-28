"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface RiasecRadarProps {
  labels: string[];
  values: number[];
  config: { max: number; seriesLabel: string };
}

export function RiasecRadar({ labels, values, config }: RiasecRadarProps) {
  const data = labels.map((label, i) => ({ dimensi: label, skor: values[i] }));
  const chartConfig = { skor: { label: config.seriesLabel, color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-sm">
      <RadarChart data={data} outerRadius="64%">
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarGrid className="stroke-border" />
        <PolarAngleAxis dataKey="dimensi" tick={{ fontSize: 12, fontWeight: 600 }} />
        <PolarRadiusAxis domain={[0, config.max]} tick={false} axisLine={false} />
        <Radar
          dataKey="skor"
          animationDuration={900}
          fill="var(--color-skor)"
          fillOpacity={0.25}
          stroke="var(--color-skor)"
          strokeWidth={2}
          dot={{ r: 3, fillOpacity: 1 }}
        />
      </RadarChart>
    </ChartContainer>
  );
}
