import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  href?: string;
  inverted?: boolean;
}

export function SiteLogo({ href = "/", inverted = false }: SiteLogoProps) {
  return (
    <Link href={href} className="group flex items-center gap-2 font-bold" aria-label="PathKarier, ke beranda">
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg transition-transform group-hover:-rotate-12",
          inverted ? "bg-white/15 text-white" : "bg-emerald-100 text-primary",
        )}
      >
        <Compass className="size-4" />
      </span>
      <span className={cn("text-lg", inverted ? "text-white" : "text-foreground")}>
        Path<span className={inverted ? "text-lime-200" : "text-primary"}>Karier</span>
      </span>
    </Link>
  );
}
