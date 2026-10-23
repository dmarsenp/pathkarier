import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { id: string };
}

// FR-22: admin mengatur role akses pengguna (role-based access control).
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const role = body?.role === "ADMIN" ? "ADMIN" : body?.role === "USER" ? "USER" : null;
  if (!role) return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });

  if (params.id === session.user.id && role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak bisa menurunkan role akun sendiri." }, { status: 400 });
  }

  const user = await prisma.user
    .update({ where: { id: params.id }, data: { role }, select: { id: true, name: true, email: true, role: true } })
    .catch(() => null);
  if (!user) return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ user });
}
