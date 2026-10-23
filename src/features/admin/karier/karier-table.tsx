"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { topCode } from "@/lib/engine/riasec";
import type { RiasecScores } from "@/types";
import { KarierFormDialog, type KarierFormValues } from "@/features/admin/karier/karier-form-dialog";

export interface KarierRow extends KarierFormValues {
  id: string;
  skillCount: number;
}

export function KarierTable({ careers }: { careers: KarierRow[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/karier/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (res.status === 409) {
      const confirmForce = window.confirm(`${data.error} Tetap hapus beserta riwayat rekomendasi tersebut?`);
      if (!confirmForce) return;
      const retry = await fetch(`/api/admin/karier/${id}?force=1`, { method: "DELETE" });
      if (!retry.ok) {
        toast.error("Gagal menghapus karier.");
        return;
      }
      toast.success("Karier dihapus.");
      router.refresh();
      return;
    }

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menghapus karier.");
      return;
    }
    toast.success("Karier dihapus.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <KarierFormDialog mode="create" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Karier</TableHead>
            <TableHead>Profil Singkat</TableHead>
            <TableHead>Tipe RIASEC</TableHead>
            <TableHead>Skill terkait</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {careers.map((career) => {
            const scores: RiasecScores = {
              R: career.profilR,
              I: career.profilI,
              A: career.profilA,
              S: career.profilS,
              E: career.profilE,
              C: career.profilC,
            };
            const code = topCode(scores, 2);
            return (
              <TableRow key={career.id}>
                <TableCell className="font-medium">{career.nama}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{career.ringkas}</TableCell>
                <TableCell>
                  <Badge variant="outline">{code.join(" - ")}</Badge>
                </TableCell>
                <TableCell>{career.skillCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <KarierFormDialog key={JSON.stringify(career)} mode="edit" initial={career} />
                    <AdminDeleteDialog
                      title={`Hapus karier "${career.nama}"?`}
                      description="Relasi skill dan riwayat rekomendasi yang terkait karier ini akan ikut terhapus. Tindakan ini tidak dapat dibatalkan."
                      onConfirm={() => handleDelete(career.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
