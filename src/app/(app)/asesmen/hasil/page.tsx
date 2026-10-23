import type { Metadata } from "next";
import { AssessmentResult } from "@/features/asesmen/assessment-result";

export const metadata: Metadata = { title: "Hasil tes minat" };

export default function AsesmenHasilPage() {
  return <AssessmentResult />;
}
