import { getServerSession } from "next-auth";
import { SiteLogo } from "@/components/layout/site-logo";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { authOptions } from "@/lib/auth-options";

export async function AppHeader() {
  const session = await getServerSession(authOptions);
  const nama = session?.user?.name ?? "Pengguna";
  const email = session?.user?.email ?? "";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-1">
          <MobileNav />
          <SiteLogo href="/dashboard" />
        </div>
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <UserMenu nama={nama} email={email} isAdmin={session?.user?.role === "ADMIN"} />
      </div>
    </header>
  );
}
