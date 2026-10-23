import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const DIMS = ["R", "I", "A", "S", "E", "C"] as const;

function parseProfil(body: Record<string, unknown>) {
  const profil: Record<string, number> = {};
  for (const dim of DIMS) {
    const value = Number(body[`profil${dim}`]);
    if (!Number.isFinite(value) || value < 0 || value > 10) return null;
    profil[dim] = value;
  }
  return profil;
}

interface RouteParams {
  params: { id: string };
}

// FR-18: admin mengubah data karier (nama, profil RIASEC).
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const nama = typeof body?.nama === "string" ? body.nama.trim() : "";
  const ringkas = typeof body?.ringkas === "string" ? body.ringkas.trim() : "";
  const deskripsi = typeof body?.deskripsi === "string" ? body.deskripsi.trim() : "";
  const tanggungJawab = Array.isArray(body?.tanggungJawab) ? body.tanggungJawab.filter((t: unknown) => typeof t === "string" && t.trim()) : [];
  const profil = body ? parseProfil(body) : null;

  if (!nama || !ringkas || !deskripsi || tanggungJawab.length === 0 || !profil) {
    return NextResponse.json({ error: "Data karier tidak lengkap atau tidak valid." }, { status: 400 });
  }

  const career = await prisma.career
    .update({
      where: { id: params.id },
      data: {
        nama,
        ringkas,
        deskripsi,
        tanggungJawab,
        profilR: profil.R,
        profilI: profil.I,
        profilA: profil.A,
        profilS: profil.S,
        profilE: profil.E,
        profilC: profil.C,
      },
    })
    .catch(() => null);

  if (!career) return NextResponse.json({ error: "Karier tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ career });
}

// FR-18: admin menghapus karier. Peringatan dulu bila masih direferensikan riwayat rekomendasi (UC-07 exception).
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const force = new URL(request.url).searchParams.get("force") === "1";

  const recCount = await prisma.recommendation.count({ where: { careerId: params.id } });
  if (recCount > 0 && !force) {
    return NextResponse.json(
      { error: `Karier ini masih direferensikan ${recCount} riwayat rekomendasi pengguna.`, recCount },
      { status: 409 },
    );
  }

  await prisma.career.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ deleted: true });
}
