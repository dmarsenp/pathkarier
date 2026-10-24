export type RiasecDim = "R" | "I" | "A" | "S" | "E" | "C";
export type RiasecScores = Record<RiasecDim, number>;

export type SkillLevel = "belum" | "dasar" | "mahir";
export type UserStatus = "mahasiswa_akhir" | "lulusan_baru" | "career_switcher";

export type CareerId = "frontend" | "backend" | "data-analyst" | "ui-ux" | "qa";

export interface CareerSkill {
  nama: string;
  bobot: number;
}

export interface Career {
  id: CareerId;
  nama: string;
  ringkas: string;
  deskripsi: string;
  tanggungJawab: string[];
  profil: RiasecScores;
  skills: CareerSkill[];
}

export interface UserSkill {
  nama: string;
  level: SkillLevel;
}

export interface SkillGap {
  nama: string;
  bobot: number;
  level: SkillLevel;
  gap: number;
}

export interface Recommendation {
  idKarier: CareerId;
  peringkat: number;
  skorRiasec: number;
  skorSkill: number;
  skorSaw: number;
}

export interface Question {
  id: number;
  dimensi: RiasecDim;
  teks: string;
}

export interface RoadmapStep {
  urutan: number;
  skill: string;
  aktivitas: string;
  estimasiMinggu: number;
  videoUrl?: string;
  videoTitle?: string;
  sertifikatUrl?: string | null;
}

export interface PortfolioProject {
  judul: string;
  skillTerkait: string[];
}

// Jalur karier yang dipilih pengguna. Prioritas 1 = jalur utama.
export interface CareerPlan {
  idKarier: CareerId;
  prioritas: number;
  disimpanPada: string;
  skorSaw: number;
  roadmap: RoadmapStep[];
  selesai: Record<number, string>;
}

export type ResourceKind = "kursus" | "sertifikasi" | "program" | "materi";
export type ResourceRegion = "indonesia" | "internasional";
export type ResourceCost = "gratis" | "sebagian-gratis";

export interface LearningResource {
  id: string;
  judul: string;
  penyedia: string;
  url: string;
  jenis: ResourceKind;
  wilayah: ResourceRegion;
  biaya: ResourceCost;
  bahasa: "Indonesia" | "Inggris";
  sertifikat: boolean;
  catatan?: string;
  skills: string[];
}

export interface AiRoadmap {
  penjelasan: string[];
  roadmap: RoadmapStep[];
  proyekPortofolio: PortfolioProject[];
}
