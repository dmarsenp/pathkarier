import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { scoreAssessment } from "@/lib/engine/riasec";
import { prisma } from "@/lib/prisma";

// FR-04/FR-05: hitung skor 6 dimensi RIASEC dari jawaban, simpan beserta tanggal pengerjaan.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const answers = body?.answers as Record<string, number> | undefined;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Jawaban tidak valid." }, { status: 400 });
  }

  const questions = await prisma.riasecQuestion.findMany({ where: { aktif: true }, orderBy: { urutan: "asc" } });
  if (questions.length === 0) {
    return NextResponse.json({ error: "Bank soal belum tersedia." }, { status: 500 });
  }

  const missing = questions.find((q) => answers[q.id] === undefined);
  if (missing) {
    return NextResponse.json({ error: "Masih ada pertanyaan yang belum dijawab." }, { status: 400 });
  }

  const numericAnswers = Object.fromEntries(Object.entries(answers).map(([id, v]) => [Number(id), Number(v)]));
  const scores = scoreAssessment(questions, numericAnswers);

  const assessment = await prisma.riasecAssessment.create({
    data: {
      userId: session.user.id,
      r: scores.R,
      i: scores.I,
      a: scores.A,
      s: scores.S,
      e: scores.E,
      c: scores.C,
      answers: {
        createMany: {
          data: questions.map((q) => ({ questionId: q.id, value: numericAnswers[q.id] })),
        },
      },
    },
  });

  return NextResponse.json({
    scores,
    completedAt: assessment.completedAt,
  });
}

// FR-05: ambil hasil asesmen terbaru milik pengguna.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const latest = await prisma.riasecAssessment.findFirst({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
  });

  if (!latest) {
    return NextResponse.json({ result: null });
  }

  return NextResponse.json({
    result: {
      scores: { R: latest.r, I: latest.i, A: latest.a, S: latest.s, E: latest.e, C: latest.c },
      completedAt: latest.completedAt,
    },
  });
}
