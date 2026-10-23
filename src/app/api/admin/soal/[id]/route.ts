import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { RiasecDim } from "@prisma/client";

const DIMS: RiasecDim[] = ["R", "I", "A", "S", "E", "C"];

interface RouteParams {
  params: { id: string };
}

// FR-21: admin mengubah pertanyaan beserta pemetaan dimensi RIASEC-nya.
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const id = Number(params.id);
  const body = await request.json().catch(() => null);
  const teks = typeof body?.teks === "string" ? body.teks.trim() : "";
  const dimensi = typeof body?.dimensi === "string" ? body.dimensi : "";
  const aktif = Boolean(body?.aktif);

  if (!Number.isInteger(id) || !teks || !DIMS.includes(dimensi as RiasecDim)) {
    return NextResponse.json({ error: "Data soal tidak valid." }, { status: 400 });
  }

  const question = await prisma.riasecQuestion
    .update({ where: { id }, data: { teks, dimensi: dimensi as RiasecDim, aktif } })
    .catch(() => null);
  if (!question) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ question });
}

// FR-21/UC-09 exception: bila soal sudah dipakai di jawaban asesmen, nonaktifkan (soft-delete) alih-alih hapus permanen.
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "ID soal tidak valid." }, { status: 400 });

  const answerCount = await prisma.riasecAnswer.count({ where: { questionId: id } });
  if (answerCount > 0) {
    await prisma.riasecQuestion.update({ where: { id }, data: { aktif: false } });
    return NextResponse.json({
      softDeleted: true,
      message: `Soal ini sudah dipakai di ${answerCount} jawaban asesmen, sehingga dinonaktifkan (bukan dihapus permanen).`,
    });
  }

  await prisma.riasecQuestion.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ deleted: true });
}
