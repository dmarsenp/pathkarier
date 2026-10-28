import type { RiasecDim } from "@/types";

interface RiasecMeta {
  key: RiasecDim;
  nama: string;
  ringkas: string;
  chip: string;
  bar: string;
}

export const RIASEC_ORDER: RiasecDim[] = ["R", "I", "A", "S", "E", "C"];

export const RIASEC_META: Record<RiasecDim, RiasecMeta> = {
  R: { key: "R", nama: "Realistic", ringkas: "Praktis, teknis, suka bekerja langsung dengan alat.", chip: "bg-orange-100 text-orange-700", bar: "bg-orange-500" },
  I: { key: "I", nama: "Investigative", ringkas: "Analitis, ingin tahu, suka memecahkan masalah.", chip: "bg-violet-100 text-violet-700", bar: "bg-violet-500" },
  A: { key: "A", nama: "Artistic", ringkas: "Kreatif, ekspresif, terbuka pada ide baru.", chip: "bg-pink-100 text-pink-700", bar: "bg-pink-500" },
  S: { key: "S", nama: "Social", ringkas: "Empatik, komunikatif, suka membantu orang lain.", chip: "bg-teal-100 text-teal-700", bar: "bg-teal-500" },
  E: { key: "E", nama: "Enterprising", ringkas: "Persuasif, berinisiatif, senang memimpin.", chip: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  C: { key: "C", nama: "Conventional", ringkas: "Terstruktur, teliti, nyaman dengan keteraturan.", chip: "bg-sky-100 text-sky-700", bar: "bg-sky-500" },
};

export const LIKERT_OPTIONS = [
  { value: 1, label: "Sangat tidak sesuai" },
  { value: 2, label: "Tidak sesuai" },
  { value: 3, label: "Netral" },
  { value: 4, label: "Sesuai" },
  { value: 5, label: "Sangat sesuai" },
] as const;
