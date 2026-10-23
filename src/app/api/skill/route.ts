import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import type { SkillLevel } from "@prisma/client";

const LEVELS: SkillLevel[] = ["belum", "dasar", "mahir"];

// FR-06: skill & level penguasaan milik pengguna yang sedang login.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const userSkills = await prisma.userSkill.findMany({
    where: { userId: session.user.id },
    include: { skill: true },
  });

  return NextResponse.json({ skills: userSkills.map((us) => ({ nama: us.skill.nama, level: us.level })) });
}

// FR-07: validasi input skill terhadap master data Skill (tidak dapat input bebas).
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const items = body?.skills as { nama: string; level: string }[] | undefined;
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Data skill tidak valid." }, { status: 400 });
  }

  for (const item of items) {
    if (!LEVELS.includes(item.level as SkillLevel)) {
      return NextResponse.json({ error: `Level tidak valid untuk skill "${item.nama}".` }, { status: 400 });
    }
  }

  const masterSkills = await prisma.skill.findMany({ where: { nama: { in: items.map((i) => i.nama) } } });
  const masterByName = new Map(masterSkills.map((s) => [s.nama, s.id]));
  const invalid = items.find((item) => !masterByName.has(item.nama));
  if (invalid) {
    return NextResponse.json({ error: `Skill "${invalid.nama}" tidak terdaftar di master data.` }, { status: 422 });
  }

  await prisma.$transaction([
    prisma.userSkill.deleteMany({ where: { userId: session.user.id } }),
    prisma.userSkill.createMany({
      data: items.map((item) => ({
        userId: session.user.id,
        skillId: masterByName.get(item.nama)!,
        level: item.level as SkillLevel,
      })),
    }),
  ]);

  return NextResponse.json({ saved: items.length });
}
