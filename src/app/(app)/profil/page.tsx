import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Lock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/features/profil/profile-form";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, status: true, pendidikan: true, jurusan: true, tahunLulus: true },
      })
    : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profil"
        title="Lengkapi profilmu"
        description="Informasi ini membantu kami memahami titik awalmu. Hanya butuh satu menit."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <ProfileForm
          nama={user?.name ?? ""}
          email={user?.email ?? ""}
          status={user?.status ?? undefined}
          pendidikan={user?.pendidikan ?? undefined}
          jurusan={user?.jurusan ?? undefined}
          tahunLulus={user?.tahunLulus ?? undefined}
        />
        <aside className="space-y-4">
          <div className="rounded-2xl bg-secondary/70 p-5">
            <Sparkles className="mb-3 size-5 text-primary" />
            <p className="font-semibold">Kenapa kami bertanya?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Status dan latar belakangmu membantu AI menyesuaikan contoh dan tempo roadmap belajar.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <Lock className="mb-3 size-5 text-primary" />
            <p className="font-semibold">Data kamu aman</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nama dan email tidak pernah dikirim ke layanan AI. Data hanya dipakai untuk profil dan penelitian.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
