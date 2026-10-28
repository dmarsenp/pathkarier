import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RoadmapLoadingProps {
  slow?: boolean;
}

export function RoadmapLoading({ slow = false }: RoadmapLoadingProps) {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm font-medium">
        <Loader2 className="size-4 animate-spin text-primary" />
        Menganalisis hasil RIASEC dan skill gap-mu…
      </div>
      {slow && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Layanan AI sedang ramai, kami mencoba jalur cadangan. Mohon tunggu sebentar, jangan tutup halaman ini.
        </p>
      )}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="space-y-4 border-l-2 border-dashed pl-8">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
