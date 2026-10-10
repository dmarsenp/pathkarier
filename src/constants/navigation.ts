export const APP_NAV = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/asesmen/pengantar", label: "Tes minat", match: "/asesmen" },
  { href: "/skill", label: "Skill" },
  { href: "/rekomendasi", label: "Rekomendasi" },
  { href: "/jalur", label: "Jalur belajar" },
] as const;

export const JOURNEY_STEPS = [
  { label: "Profil", href: "/profil" },
  { label: "Tes minat", href: "/asesmen/pengantar" },
  { label: "Skill", href: "/skill" },
  { label: "Rekomendasi", href: "/rekomendasi" },
] as const;
