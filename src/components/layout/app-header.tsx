import { SiteLogo } from "@/components/layout/site-logo";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { MOCK_USER } from "@/constants/mock";

export function AppHeader() {
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
        <UserMenu nama={MOCK_USER.nama} email={MOCK_USER.email} />
      </div>
    </header>
  );
}
