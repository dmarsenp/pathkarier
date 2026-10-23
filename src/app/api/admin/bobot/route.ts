import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// FR-20: admin mengatur bobot kriteria SAW (minat vs kesiapan skill).
export async function PUT(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const minat = Number(body?.minat);
  const skill = Number(body?.skill);

  if (!Number.isFinite(minat) || !Number.isFinite(skill) || minat < 0 || skill < 0 || Math.abs(minat + skill - 1) > 0.001) {
    return NextResponse.json({ error: "Total bobot harus sama dengan 100%." }, { status: 400 });
  }

  const weight = await prisma.criteriaWeight.upsert({
    where: { id: 1 },
    update: { minat, skill },
    create: { id: 1, minat, skill },
  });

  return NextResponse.json({ weight });
}
