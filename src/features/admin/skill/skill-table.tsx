"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SkillFormDialog } from "@/features/admin/skill/skill-form-dialog";

export interface SkillRow {
  id: string;
  nama: string;
  careerCount: number;
  userCount: number;
}

export function SkillTable({ skills }: { skills: SkillRow[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/skill/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (res.status === 409) {
      const confirmForce = window.confirm(`${data.error} Tetap hapus?`);
      if (!confirmForce) return;
      const retry = await fetch(`/api/admin/skill/${id}?force=1`, { method: "DELETE" });
      if (!retry.ok) {
        toast.error("Gagal menghapus skill.");
        return;
      }
      toast.success("Skill dihapus.");
      router.refresh();
      return;
    }

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menghapus skill.");
      return;
    }
    toast.success("Skill dihapus.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SkillFormDialog mode="create" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Skill</TableHead>
            <TableHead>Dipakai di karier</TableHead>
            <TableHead>Dimiliki pengguna</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell className="font-medium">{skill.nama}</TableCell>
              <TableCell>{skill.careerCount}</TableCell>
              <TableCell>{skill.userCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <SkillFormDialog key={`${skill.id}-${skill.nama}`} mode="edit" id={skill.id} nama={skill.nama} />
                  <AdminDeleteDialog
                    title={`Hapus skill "${skill.nama}"?`}
                    description="Skill akan hilang dari semua karier dan profil pengguna yang memakainya. Tindakan ini tidak dapat dibatalkan."
                    onConfirm={() => handleDelete(skill.id)}
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
