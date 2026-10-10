"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  vertical?: boolean;
  onNavigate?: () => void;
}

export function NavLinks({ vertical = false, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-1", vertical ? "flex-col" : "items-center")}>
      {APP_NAV.map((item) => {
        const match = "match" in item ? item.match : item.href;
        const active = pathname.startsWith(match);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground",
              active && "bg-secondary text-secondary-foreground",
              vertical && "rounded-lg px-4 py-3 text-base",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
