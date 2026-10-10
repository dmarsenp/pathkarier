import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/layout/site-logo";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <SiteLogo />
        <nav className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full border-primary px-5 text-primary hover:bg-secondary hover:text-primary">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/register">Daftar</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
