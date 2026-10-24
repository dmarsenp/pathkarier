"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface PenggunaRow {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export function PenggunaTable({ users, currentUserId }: { users: PenggunaRow[]; currentUserId: string }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleRoleChange(id: string, role: string) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/pengguna/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Gagal mengubah role.");
        return;
      }
      toast.success("Role pengguna diperbarui.");
      router.refresh();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Bergabung</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.name}
              {user.id === currentUserId && (
                <Badge variant="outline" className="ml-2">
                  Kamu
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Select
                  value={user.role}
                  onValueChange={(role) => handleRoleChange(user.id, role)}
                  disabled={user.id === currentUserId || savingId === user.id}
                >
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {savingId === user.id && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
