import Image from "next/image";
import { SiteLogo } from "@/components/layout/site-logo";

interface AuthShellProps {
  children: React.ReactNode;
}

// Layout fluid mengikuti desain: blob memenuhi layar (lengkungan di ±80% tinggi),
// ilustrasi dan card sama-sama berada di tengah vertikal.
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-background">
      <Image src="/auth/bg.webp" alt="" fill priority sizes="100vw" className="-z-10 object-fill" aria-hidden />
      <header className="absolute inset-x-0 top-0 z-10 px-5 py-4 sm:px-[5vw]">
        <SiteLogo />
      </header>
      <main className="grid min-h-dvh items-center gap-8 px-4 pb-10 pt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,min(27rem,34vw))] md:gap-[5vw] md:px-[6vw] md:pb-0 md:pr-[9vw] md:pt-0">
        <div className="hidden md:block">
          <Image
            src="/auth/students.webp"
            alt="Ilustrasi dua mahasiswa yang siap menemukan arah kariernya"
            width={711}
            height={474}
            priority
            className="mx-auto w-full max-w-[44vw] -translate-y-[2vh] animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both"
          />
        </div>
        <div className="mx-auto w-full max-w-md animate-in rounded-3xl border border-white/70 bg-card p-6 shadow-[0_12px_40px_rgba(16,64,40,0.08)] duration-700 fade-in slide-in-from-bottom-4 fill-mode-both sm:p-8 md:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
