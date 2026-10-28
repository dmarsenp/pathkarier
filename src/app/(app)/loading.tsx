import { Skeleton } from "@/components/ui/skeleton";

// Tampil seketika saat pindah halaman, selagi data halaman tujuan diambil dari server.
export default function AppLoading() {
  return (
    <div className="space-y-8" role="status" aria-label="Memuat halaman">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}
