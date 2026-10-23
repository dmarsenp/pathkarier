import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getCareerDetail, RecommendationPrerequisiteError } from "@/lib/recommendation";

interface RouteParams {
  params: { idKarier: string };
}

// FR-13 s/d FR-16: skor, alasan kecocokan, skill gap, dan roadmap pembelajaran untuk satu karier.
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  try {
    const detail = await getCareerDetail(session.user.id, params.idKarier);
    if (!detail) {
      return NextResponse.json({ error: "Karier tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (error) {
    if (error instanceof RecommendationPrerequisiteError) {
      return NextResponse.json({ error: error.reason }, { status: 409 });
    }
    throw error;
  }
}
