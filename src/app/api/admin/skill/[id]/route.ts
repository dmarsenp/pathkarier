import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { id: string };
}

// FR-19: admin mengubah nama skill master.
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const nama = typeof body?.nama === "string" ? body.nama.trim() : "";
  if (!nama) return NextResponse.json({ error: "Nama skill tidak boleh kosong." }, { status: 400 });

  const skill = await prisma.skill.update({ where: { id: params.id }, data: { nama } }).catch(() => null);
  if (!skill) return NextResponse.json({ error: "Skill tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ skill });
}

// FR-19: admin menghapus skill master. Peringatan dulu bila masih dipakai karier/pengguna (UC-07 exception).
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const force = new URL(request.url).searchParams.get("force") === "1";

  const [careerCount, userCount] = await Promise.all([
    prisma.careerSkill.count({ where: { skillId: params.id } }),
    prisma.userSkill.count({ where: { skillId: params.id } }),
  ]);

  if ((careerCount > 0 || userCount > 0) && !force) {
    return NextResponse.json(
      {
        error: `Skill ini masih dipakai di ${careerCount} karier dan dimiliki ${userCount} pengguna.`,
        careerCount,
        userCount,
      },
      { status: 409 },
    );
  }

  await prisma.skill.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ deleted: true });
}
