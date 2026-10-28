import { videoLinkFor } from "@/lib/video-link";
import type { AiRoadmap, SkillGap } from "@/types";

const ACTIVITIES = [
  "Pelajari konsep dasarnya dari dokumentasi resmi, lalu kerjakan 3 latihan kecil.",
  "Ikuti satu kursus singkat dan catat poin penting di catatan belajar.",
  "Terapkan di proyek kecil, lalu minta teman atau mentor meninjau hasilnya.",
  "Bangun satu fitur utuh yang memakai skill ini dari awal sampai selesai.",
  "Rangkum yang kamu pelajari dalam satu tulisan singkat sebagai dokumentasi proyek.",
];

// Roadmap dasar yang disusun dari skill gap tanpa AI, dipakai saat penyedia AI gagal atau belum dipanggil.
export function buildBaseRoadmap(careerName: string, gaps: SkillGap[]): AiRoadmap {
  const top = gaps.slice(0, 2).map((g) => g.nama);
  return {
    penjelasan: [
      `Profil minatmu menunjukkan kecocokan yang baik dengan pekerjaan ${careerName}. Kamu sudah punya fondasi skill untuk mulai membangun portofolio.`,
      `Fokus utama berikutnya adalah ${top.join(" dan ")}. Menguasai keduanya akan menaikkan kesiapanmu paling besar untuk peran ini.`,
    ],
    roadmap: gaps.map((gap, i) => ({
      urutan: i + 1,
      skill: gap.nama,
      aktivitas: ACTIVITIES[i % ACTIVITIES.length],
      estimasiMinggu: Math.min(12, Math.max(1, Math.round(gap.gap * 1.5))),
      ...videoLinkFor(gap.nama),
    })),
    proyekPortofolio: [
      { judul: `Proyek mini ${careerName}: studi kasus dari awal sampai akhir`, skillTerkait: top },
      { judul: "Perbaiki proyek lama dengan skill yang baru dipelajari", skillTerkait: gaps.slice(2, 4).map((g) => g.nama) },
    ],
  };
}
