import type { Question } from "@/types";

// Bank soal asesmen RIASEC: 5 pernyataan per dimensi, diselang-seling antardimensi.
export const RIASEC_QUESTIONS: Question[] = [
  { id: 1, dimensi: "R", teks: "Saya senang merakit atau memperbaiki perangkat komputer." },
  { id: 2, dimensi: "I", teks: "Saya suka mencari tahu penyebab sebuah masalah sampai tuntas." },
  { id: 3, dimensi: "A", teks: "Saya senang membuat desain atau karya visual." },
  { id: 4, dimensi: "S", teks: "Saya senang menjelaskan sesuatu kepada teman yang kesulitan." },
  { id: 5, dimensi: "E", teks: "Saya nyaman memimpin diskusi kelompok." },
  { id: 6, dimensi: "C", teks: "Saya suka menyusun data ke dalam tabel yang rapi." },
  { id: 7, dimensi: "R", teks: "Saya lebih suka belajar dengan langsung mencoba." },
  { id: 8, dimensi: "I", teks: "Saya tertarik membaca tentang cara kerja teknologi baru." },
  { id: 9, dimensi: "A", teks: "Saya sering punya ide yang berbeda dari kebanyakan orang." },
  { id: 10, dimensi: "S", teks: "Saya senang bekerja dalam tim dan saling membantu." },
  { id: 11, dimensi: "E", teks: "Saya suka meyakinkan orang lain tentang ide saya." },
  { id: 12, dimensi: "C", teks: "Saya teliti saat memeriksa detail pekerjaan." },
  { id: 13, dimensi: "R", teks: "Saya senang mengatur jaringan atau perangkat keras." },
  { id: 14, dimensi: "I", teks: "Saya menikmati soal logika dan teka-teki." },
  { id: 15, dimensi: "A", teks: "Saya peduli pada tampilan dan estetika sebuah produk." },
  { id: 16, dimensi: "S", teks: "Saya mudah memahami perasaan orang lain." },
  { id: 17, dimensi: "E", teks: "Saya tertarik memulai proyek atau usaha sendiri." },
  { id: 18, dimensi: "C", teks: "Saya nyaman mengikuti prosedur yang jelas." },
  { id: 19, dimensi: "R", teks: "Saya suka pekerjaan yang hasilnya bisa langsung terlihat." },
  { id: 20, dimensi: "I", teks: "Saya senang menganalisis data untuk menemukan pola." },
  { id: 21, dimensi: "A", teks: "Saya menikmati menulis, menggambar, atau membuat konten." },
  { id: 22, dimensi: "S", teks: "Saya ingin pekerjaan saya berdampak bagi orang lain." },
  { id: 23, dimensi: "E", teks: "Saya senang mengambil keputusan di bawah tekanan." },
  { id: 24, dimensi: "C", teks: "Saya suka membuat dokumentasi yang lengkap." },
  { id: 25, dimensi: "R", teks: "Saya tertarik mengotak-atik perangkat dan alat kerja." },
  { id: 26, dimensi: "I", teks: "Saya suka bereksperimen untuk menguji sebuah ide." },
  { id: 27, dimensi: "A", teks: "Saya senang merancang pengalaman yang menarik bagi pengguna." },
  { id: 28, dimensi: "S", teks: "Saya senang menjadi mentor bagi orang lain." },
  { id: 29, dimensi: "E", teks: "Saya suka menegosiasikan kesepakatan." },
  { id: 30, dimensi: "C", teks: "Saya merasa puas saat semua berjalan sesuai rencana." },
];

export const QUESTIONS_PER_PAGE = 5;
