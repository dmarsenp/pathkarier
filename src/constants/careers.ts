import type { Career } from "@/types";

// Skill & bobot: SPEC 12.5 (hasil survei praktisi).
// Profil RIASEC: fixture uji SPEC 12.3, BUKAN data O*NET. TODO(tim): ganti dengan data O*NET.
// Deskripsi & tanggung jawab: teks sementara. TODO(tim): ganti dengan deskripsi final dari seed.
export const CAREERS: Career[] = [
  {
    id: "frontend",
    nama: "Frontend Developer",
    ringkas: "Membangun tampilan web yang interaktif, cepat, dan mudah dipakai.",
    deskripsi:
      "Frontend developer mengubah desain menjadi halaman web yang berjalan di browser. Pekerjaannya memadukan logika pemrograman dengan kepekaan visual agar aplikasi terasa nyaman di berbagai perangkat.",
    tanggungJawab: [
      "Mengubah desain UI menjadi komponen yang dapat dipakai ulang",
      "Memastikan tampilan responsif dan aksesibel",
      "Menghubungkan antarmuka dengan REST API",
      "Menjaga performa dan kualitas kode frontend",
    ],
    profil: { R: 4, I: 5, A: 5, S: 2, E: 2, C: 4 },
    skills: [
      { nama: "HTML & CSS", bobot: 2.7 },
      { nama: "JavaScript", bobot: 2.7 },
      { nama: "Framework frontend (React/Vue/Angular)", bobot: 2.5 },
      { nama: "Responsive & cross-browser design", bobot: 2.4 },
      { nama: "Version control (Git)", bobot: 2.7 },
      { nama: "Konsumsi REST API", bobot: 2.6 },
      { nama: "TypeScript", bobot: 2.0 },
      { nama: "Pengujian frontend (mis. Jest)", bobot: 1.4 },
      { nama: "State management", bobot: 2.3 },
      { nama: "Dasar aksesibilitas & UI", bobot: 2.5 },
    ],
  },
  {
    id: "backend",
    nama: "Backend Developer",
    ringkas: "Merancang API, basis data, dan logika di balik layar aplikasi.",
    deskripsi:
      "Backend developer membangun bagian server: API, basis data, autentikasi, dan integrasi layanan. Fokusnya pada keandalan, keamanan, dan struktur data yang rapi.",
    tanggungJawab: [
      "Merancang dan membangun REST API",
      "Mengelola skema dan kueri basis data",
      "Menerapkan autentikasi dan keamanan dasar",
      "Menulis pengujian dan menyiapkan deployment",
    ],
    profil: { R: 4, I: 6, A: 2, S: 1, E: 2, C: 6 },
    skills: [
      { nama: "Bahasa server (PHP/Node.js/Python/Java)", bobot: 2.88 },
      { nama: "Perancangan REST API", bobot: 3.0 },
      { nama: "Basis data & SQL", bobot: 2.88 },
      { nama: "Version control (Git)", bobot: 2.88 },
      { nama: "Autentikasi & keamanan dasar", bobot: 3.0 },
      { nama: "ORM / query builder", bobot: 2.25 },
      { nama: "Caching", bobot: 2.12 },
      { nama: "Pengujian (unit/integration)", bobot: 2.12 },
      { nama: "Dasar Docker/deployment", bobot: 2.25 },
      { nama: "Pemodelan data", bobot: 2.5 },
    ],
  },
  {
    id: "data-analyst",
    nama: "Data Analyst",
    ringkas: "Mengolah data menjadi insight yang membantu pengambilan keputusan.",
    deskripsi:
      "Data analyst mengumpulkan, membersihkan, dan menganalisis data, lalu menyampaikan temuannya lewat visualisasi dan cerita yang mudah dipahami tim bisnis.",
    tanggungJawab: [
      "Menulis kueri SQL untuk menarik data",
      "Membersihkan dan menyiapkan data",
      "Membuat dashboard dan visualisasi",
      "Mengomunikasikan temuan kepada pemangku kepentingan",
    ],
    profil: { R: 2, I: 6, A: 2, S: 2, E: 3, C: 6 },
    skills: [
      { nama: "SQL", bobot: 2.75 },
      { nama: "Spreadsheet (Excel/Sheets) lanjutan", bobot: 2.38 },
      { nama: "Visualisasi data (Power BI/Tableau/Looker)", bobot: 2.62 },
      { nama: "Statistik dasar", bobot: 2.5 },
      { nama: "Python atau R", bobot: 2.5 },
      { nama: "Pembersihan data (data cleaning)", bobot: 2.62 },
      { nama: "Pembuatan dashboard", bobot: 1.88 },
      { nama: "Pemahaman bisnis/domain", bobot: 2.0 },
      { nama: "Komunikasi hasil analisis", bobot: 2.5 },
      { nama: "Storytelling data", bobot: 2.5 },
    ],
  },
  {
    id: "ui-ux",
    nama: "UI/UX Designer",
    ringkas: "Merancang pengalaman digital yang jelas, berguna, dan menyenangkan.",
    deskripsi:
      "UI/UX designer memahami kebutuhan pengguna lewat riset, lalu menerjemahkannya menjadi alur, wireframe, dan desain visual yang siap dibangun developer.",
    tanggungJawab: [
      "Melakukan riset dan usability testing",
      "Menyusun alur, wireframe, dan prototipe",
      "Membangun dan merawat design system",
      "Menyerahkan desain ke developer dengan rapi",
    ],
    profil: { R: 2, I: 4, A: 7, S: 5, E: 3, C: 2 },
    skills: [
      { nama: "Figma", bobot: 2.83 },
      { nama: "Wireframing", bobot: 3.0 },
      { nama: "Prototyping", bobot: 2.83 },
      { nama: "Riset pengguna (user research)", bobot: 2.58 },
      { nama: "Usability testing", bobot: 2.42 },
      { nama: "Design system", bobot: 2.25 },
      { nama: "Interaction design", bobot: 2.5 },
      { nama: "Tipografi & visual design", bobot: 2.17 },
      { nama: "Information architecture", bobot: 2.42 },
      { nama: "Handoff ke developer", bobot: 2.42 },
    ],
  },
  {
    id: "qa",
    nama: "QA Engineer",
    ringkas: "Menjaga kualitas aplikasi lewat pengujian yang teliti dan terstruktur.",
    deskripsi:
      "QA engineer merancang dan menjalankan pengujian, baik manual maupun otomatis, untuk menemukan bug sebelum sampai ke pengguna.",
    tanggungJawab: [
      "Menyusun test case dari kebutuhan produk",
      "Menjalankan pengujian manual dan regresi",
      "Membuat skrip test automation dan API test",
      "Mencatat dan melacak bug sampai selesai",
    ],
    profil: { R: 4, I: 5, A: 1, S: 2, E: 2, C: 7 },
    skills: [
      { nama: "Manual testing", bobot: 3.0 },
      { nama: "Perancangan test case", bobot: 3.0 },
      { nama: "Bug tracking (mis. Jira)", bobot: 2.75 },
      { nama: "Test automation (Selenium/Cypress)", bobot: 2.62 },
      { nama: "API testing (mis. Postman)", bobot: 2.62 },
      { nama: "SQL dasar", bobot: 2.12 },
      { nama: "Pemahaman SDLC", bobot: 2.75 },
      { nama: "Regression testing", bobot: 2.62 },
      { nama: "Scripting dasar", bobot: 2.12 },
      { nama: "Ketelitian & dokumentasi", bobot: 2.88 },
    ],
  },
];

export function getCareer(id: string): Career | undefined {
  return CAREERS.find((career) => career.id === id);
}

export interface SkillGroup {
  karier: string;
  skills: string[];
}

// Master skill dikelompokkan per peran untuk pencarian (skill yang sama hanya muncul sekali).
export function getSkillGroups(): SkillGroup[] {
  const seen = new Set<string>();
  return CAREERS.map((career) => {
    const skills = career.skills.map((s) => s.nama).filter((nama) => !seen.has(nama));
    skills.forEach((nama) => seen.add(nama));
    return { karier: career.nama, skills };
  });
}
