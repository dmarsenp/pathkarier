import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// FR-22: hanya role ADMIN yang boleh memanggil endpoint /api/admin/*.
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}
