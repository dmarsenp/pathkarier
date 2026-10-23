import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import type { Career } from "@/types";

// Daftar karier untuk ditampilkan di seluruh aplikasi — dibaca dari DB (NFR-05: data-driven,
// perubahan admin langsung terlihat tanpa perlu ubah kode/redeploy).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const careerRows = await prisma.career.findMany({
    include: { skills: { include: { skill: true } } },
    orderBy: { nama: "asc" },
  });

  const careers: Career[] = careerRows.map((c) => ({
    id: c.id as Career["id"],
    nama: c.nama,
    ringkas: c.ringkas,
    deskripsi: c.deskripsi,
    tanggungJawab: c.tanggungJawab as string[],
    profil: { R: c.profilR, I: c.profilI, A: c.profilA, S: c.profilS, E: c.profilE, C: c.profilC },
    skills: c.skills.map((cs) => ({ nama: cs.skill.nama, bobot: cs.bobot })),
  }));

  return NextResponse.json({ careers });
}
