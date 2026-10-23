import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// FR-19: admin melakukan CRUD data skill master.
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const skills = await prisma.skill.findMany({
    orderBy: { nama: "asc" },
    include: { _count: { select: { careers: true, users: true } } },
  });
  return NextResponse.json({ skills });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const nama = typeof body?.nama === "string" ? body.nama.trim() : "";
  if (!nama) return NextResponse.json({ error: "Nama skill tidak boleh kosong." }, { status: 400 });

  const existing = await prisma.skill.findUnique({ where: { nama } });
  if (existing) return NextResponse.json({ error: "Skill dengan nama ini sudah ada." }, { status: 409 });

  const skill = await prisma.skill.create({ data: { nama } });
  return NextResponse.json({ skill }, { status: 201 });
}
