import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// FR-19: admin melakukan CRUD relasi Skill-Karier beserta bobotnya.
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const relations = await prisma.careerSkill.findMany({
    include: { career: { select: { id: true, nama: true } }, skill: { select: { id: true, nama: true } } },
    orderBy: [{ career: { nama: "asc" } }, { bobot: "desc" }],
  });
  const [careers, skills] = await Promise.all([
    prisma.career.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.skill.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
  ]);

  return NextResponse.json({ relations, careers, skills });
}

// Upsert: menambah relasi baru, atau memperbarui bobot bila pasangan karier-skill sudah ada.
export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const careerId = typeof body?.careerId === "string" ? body.careerId : "";
  const skillId = typeof body?.skillId === "string" ? body.skillId : "";
  const bobot = Number(body?.bobot);

  if (!careerId || !skillId || !Number.isFinite(bobot) || bobot <= 0 || bobot > 5) {
    return NextResponse.json({ error: "Data relasi tidak valid (bobot harus antara 0-5)." }, { status: 400 });
  }

  const relation = await prisma.careerSkill.upsert({
    where: { careerId_skillId: { careerId, skillId } },
    update: { bobot },
    create: { careerId, skillId, bobot },
    include: { career: { select: { nama: true } }, skill: { select: { nama: true } } },
  });

  return NextResponse.json({ relation });
}

export async function DELETE(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const url = new URL(request.url);
  const careerId = url.searchParams.get("careerId") ?? "";
  const skillId = url.searchParams.get("skillId") ?? "";
  if (!careerId || !skillId) return NextResponse.json({ error: "Parameter tidak lengkap." }, { status: 400 });

  await prisma.careerSkill.delete({ where: { careerId_skillId: { careerId, skillId } } }).catch(() => null);
  return NextResponse.json({ deleted: true });
}
