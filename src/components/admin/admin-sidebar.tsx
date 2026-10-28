"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Scale,
  Share2,
  ShieldCheck,
  SquareStack,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/karier", label: "Manajemen Karier", icon: Briefcase },
  { href: "/admin/skill", label: "Manajemen Skill", icon: SquareStack },
  { href: "/admin/relasi-skill-karier", label: "Relasi Skill-Karier", icon: Share2 },
  { href: "/admin/bobot-saw", label: "Bobot SAW", icon: Scale },
  { href: "/admin/bank-soal", label: "Bank Soal", icon: ShieldCheck },
  { href: "/admin/pengguna", label: "Manajemen Admin", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto bg-[#0b1437] text-slate-200">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="grid size-8 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">P</span>
        <span className="text-lg font-bold text-white">PathKarier</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Kelola Data</p>
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          Kembali ke aplikasi
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4.5" /> Keluar
        </button>
      </div>
    </aside>
  );
}
