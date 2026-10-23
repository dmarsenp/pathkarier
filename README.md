# PathKarier

Sistem Pendukung Keputusan (SPK) rekomendasi karier bidang Teknologi Informasi. Peringkat karier dihitung dengan metode **SAW (Simple Additive Weighting)** dari dua kriteria: kecocokan minat (RIASEC/Holland Code) dan kesiapan skill pengguna. Generative AI dipakai sebagai lapisan penjelasan dan penyusun roadmap belajar, bukan sebagai penentu peringkat.

## Fitur utama

- Tes minat RIASEC dan input penguasaan skill
- Rekomendasi karier terurut berdasarkan skor SAW
- Roadmap belajar dan penjelasan kecocokan yang dihasilkan AI, dengan fallback otomatis bila layanan AI gagal
- Pelacakan jalur belajar (jalur utama dan alternatif) beserta progres roadmap
- Panel admin: kelola data karier, skill, relasi skill-karier, bobot kriteria SAW, bank soal, dan peran pengguna

## Teknologi

Next.js (App Router) · TypeScript · Prisma + MySQL · NextAuth.js (credentials) · Tailwind CSS · Google Gemini API

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Variabel lingkungan yang dibutuhkan ada di `.env.local` (lihat `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GEMINI_API_KEY`).
