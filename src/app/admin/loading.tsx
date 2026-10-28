import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat halaman admin">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
