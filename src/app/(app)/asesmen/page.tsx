import type { Metadata } from "next";
import { PLACEHOLDER_QUESTIONS, QUESTIONS_PER_PAGE } from "@/constants/questions";
import { AssessmentRunner } from "@/features/asesmen/assessment-runner";

export const metadata: Metadata = { title: "Mengerjakan tes minat" };

export default function AsesmenPage() {
  // TODO: ambil butir aktif dari GET /api/asesmen/soal.
  return <AssessmentRunner questions={PLACEHOLDER_QUESTIONS} perPage={QUESTIONS_PER_PAGE} />;
}
