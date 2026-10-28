import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-lime-50 via-emerald-50 to-teal-50 md:flex md:min-h-[640px] md:items-center md:bg-none">
      {/* Blob ditambatkan ke bawah agar lengkungan bawahnya terlihat; bagian atasnya sengaja terpotong. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden md:block" aria-hidden>
        <div className="relative -ml-[12%] aspect-[1614/975] w-[124%] min-w-[1100px]">
          <Image src="/landing/hero-blob.webp" alt="" fill priority sizes="124vw" className="object-cover" />
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pb-40 md:pt-6">
        <Image
          src="/landing/hero-illustration.webp"
          alt="Ilustrasi mahasiswa dengan tahapan Learn & Grow, Build Experience, dan Reach Your Goals"
          width={560}
          height={352}
          priority
          className="order-2 mx-auto w-full max-w-[520px] animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both md:order-1"
        />
        <div className="order-1 animate-in space-y-5 duration-700 fade-in slide-in-from-bottom-4 fill-mode-both [animation-delay:150ms] md:order-2">
          <h1 className="text-balance text-4xl font-extrabold leading-tight text-primary md:text-5xl">
            Siap menemukan arah kariermu?
          </h1>
          <p className="max-w-md text-muted-foreground">
            Kenali potensi dirimu, jelajahi jurusan dan profesi yang sesuai, lalu susun langkah nyata menuju masa depan yang
            kamu inginkan.
          </p>
          <Button asChild size="lg" className="rounded-full px-6 shadow-lg shadow-primary/20">
            <Link href="/register">
              Mulai tes gratis <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
