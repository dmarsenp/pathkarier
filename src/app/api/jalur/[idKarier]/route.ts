import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import type { RoadmapStep } from "@/types";

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

async function renumber(userId: string, tx: typeof prisma = prisma) {
  const rows = await tx.careerPlan.findMany({ where: { userId }, orderBy: { prioritas: "asc" } });
  await Promise.all(rows.map((row, index) => tx.careerPlan.update({ where: { id: row.id }, data: { prioritas: index + 1 } })));
}

interface RouteParams {
  params: { idKarier: string };
}

// Tandai/batalkan langkah roadmap selesai, atau jadikan jalur ini prioritas utama.
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await request.json().catch(() => null);
  const action = body?.action as string | undefined;

  const plan = await prisma.careerPlan.findUnique({ where: { userId_careerId: { userId, careerId: params.idKarier } } });
  if (!plan) {
    return NextResponse.json({ error: "Jalur tidak ditemukan." }, { status: 404 });
  }

  if (action === "toggleStep") {
    const urutan = Number(body?.urutan);
    if (!Number.isFinite(urutan)) {
      return NextResponse.json({ error: "Langkah tidak valid." }, { status: 400 });
    }
    const selesai = { ...(plan.selesai as Record<number, string>) };
    if (selesai[urutan]) delete selesai[urutan];
    else selesai[urutan] = new Date().toISOString();
    await prisma.careerPlan.update({ where: { id: plan.id }, data: { selesai } });
    return NextResponse.json({ selesai });
  }

  if (action === "setCertificate") {
    const urutan = Number(body?.urutan);
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    if (!Number.isFinite(urutan) || url.length === 0) {
      return NextResponse.json({ error: "Link sertifikat tidak valid." }, { status: 400 });
    }
    const roadmap = (plan.roadmap as unknown as RoadmapStep[]).map((step) =>
      step.urutan === urutan ? { ...step, sertifikatUrl: url } : step,
    );
    await prisma.careerPlan.update({ where: { id: plan.id }, data: { roadmap: toJson(roadmap) } });
    return NextResponse.json({ roadmap });
  }

  if (action === "setPrimary") {
    await prisma.$transaction(async (tx) => {
      const others = await tx.careerPlan.findMany({
        where: { userId, NOT: { id: plan.id } },
        orderBy: { prioritas: "asc" },
      });
      await tx.careerPlan.update({ where: { id: plan.id }, data: { prioritas: 1 } });
      await Promise.all(others.map((row, index) => tx.careerPlan.update({ where: { id: row.id }, data: { prioritas: index + 2 } })));
    });
    return NextResponse.json({ saved: true });
  }

  return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 });
}

// Hapus jalur yang disimpan.
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }
  const userId = session.user.id;

  const plan = await prisma.careerPlan.findUnique({ where: { userId_careerId: { userId, careerId: params.idKarier } } });
  if (!plan) {
    return NextResponse.json({ error: "Jalur tidak ditemukan." }, { status: 404 });
  }

  await prisma.careerPlan.delete({ where: { id: plan.id } });
  await renumber(userId);

  return NextResponse.json({ deleted: true });
}
