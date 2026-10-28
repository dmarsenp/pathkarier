import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    image: "/landing/step-asesmen.webp",
    width: 258,
    title: "Asesmen RIASEC",
    body: "Isi tes minat dan bakat untuk mengetahui tipe kepribadian, minat, dan kecenderungan kariermu.",
    href: "/asesmen/pengantar",
  },
  {
    image: "/landing/step-skill.webp",
    width: 286,
    title: "Analisis skill",
    body: "Sistem mencocokkan skill-mu dengan kebutuhan kompetensi tiap peran dari survei praktisi.",
    href: "/skill",
  },
  {
    image: "/landing/step-rekomendasi.webp",
    width: 258,
    title: "Rekomendasi karier",
    body: "Dapatkan daftar karier terbaik yang sesuai profil, minat, dan potensimu, lengkap dengan roadmap belajar.",
    href: "/rekomendasi",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:py-24">
      <Reveal>
        <h2 className="mb-8 text-3xl font-extrabold text-primary md:text-4xl">Bagaimana cara kerjanya?</h2>
      </Reveal>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Reveal order={index} className="h-full">
            <Link
              href={step.href}
              className="group flex h-full flex-col rounded-3xl bg-card p-6 shadow-[0_8px_30px_rgba(16,64,40,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(16,64,40,0.12)]"
            >
              <div className="mb-6 flex h-40 items-center justify-center">
                <Image src={step.image} alt="" width={step.width} height={160} className="h-auto max-h-40 w-auto" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Pelajari sekarang <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
