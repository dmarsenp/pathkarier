import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import type { CareerId, CareerPlan, RoadmapStep } from "@/types";

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

const MAX_PLANS = 3;

function toCareerPlan(row: {
  careerId: string;
  prioritas: number;
  skorSaw: number;
  roadmap: unknown;
  selesai: unknown;
  savedAt: Date;
}): CareerPlan {
  return {
    idKarier: row.careerId as CareerId,
    prioritas: row.prioritas,
    disimpanPada: row.savedAt.toISOString(),
    skorSaw: row.skorSaw,
    roadmap: row.roadmap as RoadmapStep[],
    selesai: row.selesai as Record<number, string>,
  };
}

// Jalur belajar: karier yang disimpan pengguna beserta progres roadmap-nya.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const rows = await prisma.careerPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { prioritas: "asc" },
  });

  return NextResponse.json({ plans: rows.map(toCareerPlan) });
}

// Simpan karier sebagai jalur (utama atau alternatif). Menyimpan ulang karier yang sudah ada
// hanya memindahkan posisinya, tidak menimpa roadmap/progres yang sudah berjalan.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const idKarier = body?.idKarier as string | undefined;
  const skorSaw = body?.skorSaw as number | undefined;
  const roadmap = body?.roadmap as RoadmapStep[] | undefined;
  const asPrimary = Boolean(body?.asPrimary);
  if (!idKarier || typeof skorSaw !== "number" || !Array.isArray(roadmap)) {
    return NextResponse.json({ error: "Data jalur tidak valid." }, { status: 400 });
  }

  const userId = session.user.id;
  const existing = await prisma.careerPlan.findMany({ where: { userId }, orderBy: { prioritas: "asc" } });
  const already = existing.find((p) => p.careerId === idKarier);

  if (!already && existing.length >= MAX_PLANS) {
    return NextResponse.json({ error: `Kamu sudah punya ${MAX_PLANS} jalur. Hapus salah satu untuk menambah.` }, { status: 422 });
  }

  const others = existing.filter((p) => p.careerId !== idKarier);
  const ordered = asPrimary
    ? [already?.id ?? "__new__", ...others.map((p) => p.id)]
    : [...others.map((p) => p.id), already?.id ?? "__new__"];

  await prisma.$transaction(async (tx) => {
    if (!already) {
      const created = await tx.careerPlan.create({
        data: { userId, careerId: idKarier, prioritas: 0, skorSaw, roadmap: toJson(roadmap), selesai: {} },
      });
      ordered[ordered.indexOf("__new__")] = created.id;
    }
    await Promise.all(ordered.map((id, index) => tx.careerPlan.update({ where: { id }, data: { prioritas: index + 1 } })));
  });

  return NextResponse.json({ saved: true });
}
