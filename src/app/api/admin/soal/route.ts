import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { RiasecDim } from "@prisma/client";

const DIMS: RiasecDim[] = ["R", "I", "A", "S", "E", "C"];

// FR-21: admin melakukan CRUD bank soal asesmen RIASEC.
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const questions = await prisma.riasecQuestion.findMany({ orderBy: { urutan: "asc" } });
  return NextResponse.json({ questions });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const teks = typeof body?.teks === "string" ? body.teks.trim() : "";
  const dimensi = typeof body?.dimensi === "string" ? body.dimensi : "";

  if (!teks || !DIMS.includes(dimensi)) {
    return NextResponse.json({ error: "Pertanyaan dan dimensi RIASEC wajib diisi." }, { status: 400 });
  }

  const maxUrutan = await prisma.riasecQuestion.aggregate({ _max: { urutan: true } });
  const question = await prisma.riasecQuestion.create({
    data: { teks, dimensi: dimensi as RiasecDim, urutan: (maxUrutan._max.urutan ?? 0) + 1 },
  });

  return NextResponse.json({ question }, { status: 201 });
}
