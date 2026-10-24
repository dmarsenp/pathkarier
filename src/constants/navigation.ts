export const APP_NAV = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/asesmen/hasil", label: "Tes minat", match: ["/asesmen/hasil", "/asesmen"] },
  { href: "/asesmen/pengantar", label: "Asesmen baru", match: ["/asesmen/pengantar"] },
  { href: "/skill", label: "Skill" },
  { href: "/rekomendasi", label: "Rekomendasi" },
  { href: "/jalur", label: "Jalur belajar" },
] as const;

