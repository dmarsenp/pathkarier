import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { computeAndSaveRecommendations, RecommendationPrerequisiteError } from "@/lib/recommendation";

// FR-08 s/d FR-12: hitung & kembalikan peringkat 5 karier dari skor tertinggi ke terendah.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }

  try {
    const { recommendations } = await computeAndSaveRecommendations(session.user.id);
    return NextResponse.json({ recommendations });
  } catch (error) {
    if (error instanceof RecommendationPrerequisiteError) {
      return NextResponse.json({ error: error.reason }, { status: 409 });
    }
    throw error;
  }
}
