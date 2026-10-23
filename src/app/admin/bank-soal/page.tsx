import type { Metadata } from "next";
import { SoalTable } from "@/features/admin/soal/soal-table";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Bank Soal" };

export default async function AdminBankSoalPage() {
  const questions = await prisma.riasecQuestion.findMany({ orderBy: { urutan: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Bank Soal Asesmen</h1>
        <p className="text-sm text-muted-foreground">Kelola pertanyaan asesmen RIASEC beserta pemetaan dimensinya (FR-21).</p>
      </div>
      <SoalTable questions={questions} />
    </div>
  );
}
