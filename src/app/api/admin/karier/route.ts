import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function slugify(nama: string): string {
  return nama
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

// FR-18: admin melakukan CRUD data karier.
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const careers = await prisma.career.findMany({ orderBy: { nama: "asc" }, include: { _count: { select: { skills: true } } } });
  return NextResponse.json({ careers });
}

export async function POST(request: Request) {
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

  const id = slugify(nama);
  if (!id) return NextResponse.json({ error: "Nama karier tidak valid." }, { status: 400 });

  const existing = await prisma.career.findUnique({ where: { id } });
  if (existing) return NextResponse.json({ error: "Karier dengan nama serupa sudah ada." }, { status: 409 });

  const career = await prisma.career.create({
    data: {
      id,
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
  });

  return NextResponse.json({ career }, { status: 201 });
}
