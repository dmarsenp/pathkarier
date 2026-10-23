import type { Metadata } from "next";
import { QUESTIONS_PER_PAGE } from "@/constants/questions";
import { AssessmentRunner } from "@/features/asesmen/assessment-runner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Mengerjakan tes minat" };

export default async function AsesmenPage() {
  // FR-21: bank soal diambil dari basis data, bukan lagi daftar statis di kode.
  const questions = await prisma.riasecQuestion.findMany({ where: { aktif: true }, orderBy: { urutan: "asc" } });
  return <AssessmentRunner questions={questions} perPage={QUESTIONS_PER_PAGE} />;
}
