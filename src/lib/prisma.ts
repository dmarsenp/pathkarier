import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Batas tunggu bawaan Prisma hanya 5 detik. Database serverless yang baru bangun dari idle atau jaringan yang
// sempat tersendat bisa melewatinya, lalu request pertama gagal (P1001). Dilonggarkan di sini agar tidak
// bergantung pada isi DATABASE_URL, kecuali bila sudah ditentukan sendiri di URL-nya.
function withTimeouts(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return undefined;
  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.has("connect_timeout")) url.searchParams.set("connect_timeout", "20");
    if (!url.searchParams.has("pool_timeout")) url.searchParams.set("pool_timeout", "20");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: withTimeouts(process.env.DATABASE_URL) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
