import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { planLabel, planProgress } from "@/lib/plans";
import type { Career, CareerPlan } from "@/types";

interface AltPlanCardProps {
  plan: CareerPlan;
  career: Career;
  onMakePrimary: () => void;
}

export function AltPlanCard({ plan, career, onMakePrimary }: AltPlanCardProps) {
  const progress = planProgress(plan);

  return (
    <Card className="flex flex-col rounded-2xl">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{planLabel(plan.prioritas)}</p>
          <Link href={`/jalur?karier=${career.id}`} className="text-lg font-bold hover:text-primary">
            {career.nama}
          </Link>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {progress.done}/{progress.total} langkah
            </span>
            <span className="font-semibold">{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} className="h-1.5" />
        </div>
        <div className="mt-auto flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/jalur?karier=${career.id}`}>Buka</Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={onMakePrimary}>
            <Star /> Jadikan utama
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
