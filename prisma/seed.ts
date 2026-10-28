import { PrismaClient } from "@prisma/client";
import { CAREERS } from "../src/constants/careers";
import { RIASEC_QUESTIONS } from "../src/constants/questions";

const prisma = new PrismaClient();

async function main() {
  // Bobot kriteria SAW: rata-rata survei 15 praktisi TI (Subbab 3.2.2).
  await prisma.criteriaWeight.upsert({
    where: { id: 1 },
    update: { minat: 0.45, skill: 0.55 },
    create: { id: 1, minat: 0.45, skill: 0.55 },
  });

  // Bank soal asesmen RIASEC (FR-21).
  for (const q of RIASEC_QUESTIONS) {
    await prisma.riasecQuestion.upsert({
      where: { id: q.id },
      update: { dimensi: q.dimensi, teks: q.teks, urutan: q.id },
      create: { id: q.id, dimensi: q.dimensi, teks: q.teks, urutan: q.id },
    });
  }

  // Master karier, master skill, dan relasi bobot Skill-Karier (FR-18/FR-19).
  for (const career of CAREERS) {
    await prisma.career.upsert({
      where: { id: career.id },
      update: {
        nama: career.nama,
        ringkas: career.ringkas,
        deskripsi: career.deskripsi,
        tanggungJawab: career.tanggungJawab,
        profilR: career.profil.R,
        profilI: career.profil.I,
        profilA: career.profil.A,
        profilS: career.profil.S,
        profilE: career.profil.E,
        profilC: career.profil.C,
      },
      create: {
        id: career.id,
        nama: career.nama,
        ringkas: career.ringkas,
        deskripsi: career.deskripsi,
        tanggungJawab: career.tanggungJawab,
        profilR: career.profil.R,
        profilI: career.profil.I,
        profilA: career.profil.A,
        profilS: career.profil.S,
        profilE: career.profil.E,
        profilC: career.profil.C,
      },
    });

    for (const skill of career.skills) {
      const skillRow = await prisma.skill.upsert({
        where: { nama: skill.nama },
        update: {},
        create: { nama: skill.nama },
      });

      await prisma.careerSkill.upsert({
        where: { careerId_skillId: { careerId: career.id, skillId: skillRow.id } },
        update: { bobot: skill.bobot },
        create: { careerId: career.id, skillId: skillRow.id, bobot: skill.bobot },
      });
    }
  }

  const skillCount = await prisma.skill.count();
  console.log(
    `Seed selesai: ${CAREERS.length} karier, ${skillCount} skill unik, ${RIASEC_QUESTIONS.length} soal asesmen, 1 bobot kriteria.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
