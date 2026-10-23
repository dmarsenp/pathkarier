"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RelasiFormDialog } from "@/features/admin/relasi/relasi-form-dialog";

interface Option {
  id: string;
  nama: string;
}

export interface RelasiRow {
  careerId: string;
  careerNama: string;
  skillId: string;
  skillNama: string;
  bobot: number;
}

export function RelasiTable({ relations, careers, skills }: { relations: RelasiRow[]; careers: Option[]; skills: Option[] }) {
  const router = useRouter();

  async function handleDelete(careerId: string, skillId: string) {
    const res = await fetch(`/api/admin/relasi-skill-karier?careerId=${careerId}&skillId=${skillId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Gagal menghapus relasi.");
      return;
    }
    toast.success("Relasi dihapus.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RelasiFormDialog mode="create" careers={careers} skills={skills} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Karier</TableHead>
            <TableHead>Skill</TableHead>
            <TableHead>Bobot</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relations.map((rel) => (
            <TableRow key={`${rel.careerId}-${rel.skillId}`}>
              <TableCell className="font-medium">{rel.careerNama}</TableCell>
              <TableCell>{rel.skillNama}</TableCell>
              <TableCell>{rel.bobot.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <RelasiFormDialog
                    key={`${rel.careerId}-${rel.skillId}-${rel.bobot}`}
                    mode="edit"
                    careers={careers}
                    skills={skills}
                    initial={{ careerId: rel.careerId, careerNama: rel.careerNama, skillId: rel.skillId, skillNama: rel.skillNama, bobot: rel.bobot }}
                  />
                  <AdminDeleteDialog
                    title={`Hapus relasi "${rel.skillNama}" dari "${rel.careerNama}"?`}
                    description="Skill ini tidak akan lagi dihitung sebagai kebutuhan karier tersebut."
                    onConfirm={() => handleDelete(rel.careerId, rel.skillId)}
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
