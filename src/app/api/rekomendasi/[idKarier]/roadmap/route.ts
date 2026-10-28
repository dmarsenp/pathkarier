import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { generateAiRoadmap, RecommendationPrerequisiteError } from "@/lib/recommendation";

// Rantai AI bisa mencoba beberapa model (anggaran total 50 detik, lihat LLM_TOTAL_BUDGET_MS).
export const maxDuration = 60;

interface RouteParams {
  params: { idKarier: string };
}

// FR-14/FR-15: pengguna memicu pembuatan penjelasan & roadmap oleh Generative AI.
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  try {
    const generated = await generateAiRoadmap(session.user.id, params.idKarier);
    if (!generated) {
      return NextResponse.json({ error: "Karier tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(generated);
  } catch (error) {
    if (error instanceof RecommendationPrerequisiteError) {
      return NextResponse.json({ error: error.reason }, { status: 409 });
    }
    throw error;
  }
}
