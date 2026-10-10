import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/layout/site-logo";

const FOOTER_LINKS = [
  { href: "/#tentang", label: "Tentang kami" },
  { href: "/#cara-kerja", label: "Cara kerja" },
  { href: "mailto:halo@pathkarier.id", label: "Hubungi kami" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[hsl(155_45%_16%)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:items-end md:justify-between">
        <div className="space-y-5">
          <SiteLogo inverted />
          <h2 className="max-w-md text-3xl font-bold leading-tight md:text-4xl">Siap menemukan jalur kariermu?</h2>
          <Button asChild variant="secondary" className="rounded-full px-5">
            <Link href="/register">
              Mulai sekarang <ArrowRight />
            </Link>
          </Button>
        </div>
        <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50">© 2026 PathKarier. Dibuat untuk penelitian skripsi.</p>
      </div>
    </footer>
  );
}
