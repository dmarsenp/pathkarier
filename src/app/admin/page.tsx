import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, HelpCircle, Share2, SquareStack } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Dashboard" };

export default async function AdminDashboardPage() {
  const [careerCount, skillCount, relationCount, questionCount] = await Promise.all([
    prisma.career.count(),
    prisma.skill.count(),
    prisma.careerSkill.count(),
    prisma.riasecQuestion.count({ where: { aktif: true } }),
  ]);

  const stats = [
    { label: "Total Karier", value: careerCount, icon: Briefcase, href: "/admin/karier" },
    { label: "Total Skill", value: skillCount, icon: SquareStack, href: "/admin/skill" },
    { label: "Relasi Skill-Karier", value: relationCount, icon: Share2, href: "/admin/relasi-skill-karier" },
    { label: "Soal RIASEC aktif", value: questionCount, icon: HelpCircle, href: "/admin/bank-soal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground">Kelola data master sistem rekomendasi karier.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="rounded-2xl transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <stat.icon className="size-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
