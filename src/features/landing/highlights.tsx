import Image from "next/image";

const HIGHLIGHTS = [
  {
    icon: "/landing/icon-minat.svg",
    title: "Temukan minat alami kamu",
    body: "RIASEC membantumu memahami apa yang benar-benar kamu sukai dan nikmati.",
  },
  {
    icon: "/landing/icon-gaya-kerja.svg",
    title: "Kenali gaya kerja terbaikmu",
    body: "Setiap orang punya cara kerja yang unik. RIASEC membantu menemukan gaya kerja yang paling cocok untukmu.",
  },
  {
    icon: "/landing/icon-langkah.svg",
    title: "Langkah awal menuju karier impian",
    body: "Dengan pemahaman yang tepat, kamu bisa membuat keputusan karier yang lebih percaya diri.",
  },
];

export function Highlights() {
  return (
    <section id="tentang" className="relative z-10 mx-auto mt-10 max-w-6xl scroll-mt-20 px-4 md:-mt-4">
      <div className="grid gap-8 rounded-3xl bg-card p-6 shadow-[0_8px_30px_rgba(16,64,40,0.06)] sm:p-8 md:grid-cols-3 md:gap-6">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title} className="flex gap-4">
            <Image src={item.icon} alt="" width={56} height={56} className="size-12 shrink-0 md:size-14" />
            <div className="space-y-3">
              <h3 className="text-lg font-bold leading-snug text-primary md:text-xl">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
