# Usulan: jalur belajar, progres roadmap, dan sumber belajar

Fitur tambahan di luar SPEC_APLIKASI.md. Perlu disamakan di ERD, tabel FR, dan tabel API skripsi (lihat SPEC Bagian 16).

## Fitur

| ID usulan | Fitur | Kriteria penerimaan |
|---|---|---|
| FR-24 | Simpan karier sebagai jalur (utama + alternatif) | Maks. 3 jalur per pengguna; tepat satu jalur utama; jalur bisa dijadikan utama atau dihapus kapan saja; menyimpan snapshot skor saat disimpan |
| FR-25 | Lacak progres roadmap per jalur | Tiap langkah roadmap bisa ditandai selesai/batal beserta tanggalnya; progres = langkah selesai / total |
| FR-26 | Rekomendasi kursus & sertifikasi gratis | Berasal dari tabel kurasi admin (bukan LLM, KEPUTUSAN #8); diurutkan menurut skill gap; filter lokal/internasional dan bersertifikat |

Catatan: peringkat tetap hanya dari SAW. Memilih jalur alternatif tidak mengubah peringkat.

## DDL (MySQL 8)

```sql
CREATE TABLE jalur_pengguna (
  id_pengguna INT UNSIGNED NOT NULL,
  id_karier INT UNSIGNED NOT NULL,
  id_hasil INT UNSIGNED NOT NULL,          -- snapshot hasil_rekomendasi saat disimpan
  prioritas TINYINT NOT NULL,              -- 1 = utama
  disimpan_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pengguna, id_karier),
  UNIQUE (id_pengguna, prioritas),
  FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna),
  FOREIGN KEY (id_karier) REFERENCES karier(id_karier),
  FOREIGN KEY (id_hasil) REFERENCES hasil_rekomendasi(id_hasil)
);

CREATE TABLE progres_roadmap (
  id_roadmap INT UNSIGNED NOT NULL,
  urutan TINYINT NOT NULL,                 -- roadmap.konten_ai.roadmap[].urutan
  selesai_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_roadmap, urutan),
  FOREIGN KEY (id_roadmap) REFERENCES roadmap(id_roadmap)
);

CREATE TABLE sumber_belajar (
  id_sumber INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(150) NOT NULL,
  penyedia VARCHAR(100) NOT NULL,
  url VARCHAR(300) NOT NULL,
  jenis ENUM('kursus','sertifikasi','program','materi') NOT NULL,
  wilayah ENUM('indonesia','internasional') NOT NULL,
  biaya ENUM('gratis','sebagian_gratis') NOT NULL,
  bahasa ENUM('Indonesia','Inggris') NOT NULL,
  bersertifikat BOOLEAN NOT NULL DEFAULT FALSE,
  catatan VARCHAR(300) NULL,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  diperiksa_pada DATE NULL                 -- kapan tautan & biaya terakhir dicek admin
);

CREATE TABLE sumber_belajar_skill (
  id_sumber INT UNSIGNED NOT NULL,
  id_skill INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_sumber, id_skill),
  FOREIGN KEY (id_sumber) REFERENCES sumber_belajar(id_sumber),
  FOREIGN KEY (id_skill) REFERENCES skill(id_skill)
);
```

## API

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/jalur` | Daftar jalur + progres pengguna |
| POST | `/api/jalur` | Simpan jalur `{ idKarier, sebagaiUtama }` (tolak bila sudah 3) |
| PUT | `/api/jalur/{idKarier}/utama` | Jadikan jalur utama |
| DELETE | `/api/jalur/{idKarier}` | Hapus jalur beserta progresnya |
| PUT | `/api/jalur/{idKarier}/langkah/{urutan}` | Tandai langkah selesai / batal `{ selesai: boolean }` |
| GET | `/api/sumber-belajar?karier={id}` | Sumber belajar terurut menurut skill gap |
| GET, POST, PUT, DELETE | `/api/admin/sumber-belajar` | Kurasi sumber belajar (admin) |

## Seed

Draf seed ada di `src/constants/learning-resources.ts`. Tautan dicek bisa diakses pada Oktober 2026. Status biaya Dicoding sudah dicek: kelas kini berlangganan dan hanya sebagian modul gratis, jadi ditandai `sebagian_gratis`. Tim wajib memverifikasi ulang sebelum UAT.
