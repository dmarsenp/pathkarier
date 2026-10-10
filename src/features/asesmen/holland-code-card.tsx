import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiasecChip } from "@/components/ui/riasec-chip";
import { RIASEC_META } from "@/constants/riasec";
import type { RiasecDim } from "@/types";

interface HollandCodeCardProps {
  code: RiasecDim[];
}

export function HollandCodeCard({ code }: HollandCodeCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardDescription className="text-xs font-semibold uppercase tracking-wider">Kode Holland-mu</CardDescription>
        <CardTitle className="text-2xl">{code.join("")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {code.map((dim, index) => (
          <div key={dim} className="flex items-center gap-4 rounded-xl bg-muted/60 p-3">
            <RiasecChip dim={dim} size="lg" />
            <div>
              <p className="text-xs text-muted-foreground">Minat ke-{index + 1}</p>
              <p className="font-semibold">{RIASEC_META[dim].nama}</p>
              <p className="text-sm text-muted-foreground">{RIASEC_META[dim].ringkas}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
