import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const STATUSES = ["mahasiswa_akhir", "lulusan_baru", "career_switcher"] as const;

// FR-03: pengguna melihat dan memperbarui data profil dasar.
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const status = STATUSES.includes(body?.status) ? body.status : null;
  const pendidikan = typeof body?.pendidikan === "string" && body.pendidikan ? body.pendidikan : null;
  const jurusan = typeof body?.jurusan === "string" && body.jurusan ? body.jurusan : null;
  const tahunLulus = Number.isInteger(Number(body?.tahunLulus)) && body?.tahunLulus ? Number(body.tahunLulus) : null;

  if (!name) {
    return NextResponse.json({ error: "Nama tidak boleh kosong." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, status, pendidikan, jurusan, tahunLulus },
    select: { name: true, status: true, pendidikan: true, jurusan: true, tahunLulus: true },
  });

  return NextResponse.json({ user });
}
