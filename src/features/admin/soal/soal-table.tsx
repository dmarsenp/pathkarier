"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SoalFormDialog } from "@/features/admin/soal/soal-form-dialog";
import type { RiasecDim } from "@/types";

interface SoalRow {
  id: number;
  teks: string;
  dimensi: RiasecDim;
  aktif: boolean;
}

export function SoalTable({ questions }: { questions: SoalRow[] }) {
  const router = useRouter();

  async function handleDelete(id: number) {
    const res = await fetch(`/api/admin/soal/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Gagal menghapus soal.");
      return;
    }
    toast.success(data.softDeleted ? data.message : "Soal dihapus.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SoalFormDialog mode="create" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pertanyaan</TableHead>
            <TableHead>Dimensi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="max-w-md">{q.teks}</TableCell>
              <TableCell>
                <Badge variant="outline">{q.dimensi}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={q.aktif ? "default" : "secondary"}>{q.aktif ? "Aktif" : "Nonaktif"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <SoalFormDialog
                    key={`${q.id}-${q.aktif}-${q.dimensi}-${q.teks}`}
                    mode="edit"
                    id={q.id}
                    initial={{ teks: q.teks, dimensi: q.dimensi, aktif: q.aktif }}
                  />
                  <AdminDeleteDialog
                    title={`Hapus soal ini?`}
                    description="Bila soal sudah pernah dijawab, sistem akan menonaktifkannya saja (bukan menghapus permanen) agar riwayat asesmen tetap utuh."
                    onConfirm={() => handleDelete(q.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
