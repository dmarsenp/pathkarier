export { default } from "next-auth/middleware";

// FR-02: halaman di bawah ini hanya bisa diakses setelah login.
// FR-22: /admin/* juga butuh login di sini; pembatasan role ADMIN dicek lagi di admin/layout.tsx.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/asesmen/:path*",
    "/skill/:path*",
    "/rekomendasi/:path*",
    "/jalur/:path*",
    "/profil/:path*",
    "/admin/:path*",
  ],
};
