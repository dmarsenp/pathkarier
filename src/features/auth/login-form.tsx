"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormProgress } from "@/components/ui/form-progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/features/auth/password-input";

export function LoginForm() {
  const router = useRouter();
  // Selama tidak null, form terkunci. Sengaja tidak di-reset saat sukses: form baru lepas setelah dashboard terbuka.
  const [progress, setProgress] = useState<string | null>(null);
  const busy = progress !== null;

  // FR-02: pesan gagal generik, tidak membocorkan field yang salah (email terdaftar atau password salah).
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);

    setProgress("Memeriksa akunmu...");
    try {
      const result = await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        redirect: false,
      });
      if (result?.error) {
        setProgress(null);
        toast.error("Email atau password salah.");
        return;
      }
      setProgress("Berhasil masuk. Menyiapkan dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setProgress(null);
      toast.error("Koneksi bermasalah. Periksa internetmu lalu coba lagi.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary md:text-[clamp(1.3rem,2.1vw,1.9rem)]">Selamat datang kembali</h1>
        <p className="text-sm text-muted-foreground">Lanjutkan perjalananmu menuju karier yang sesuai dengan potensimu.</p>
      </div>
      <form onSubmit={handleSubmit} aria-busy={busy}>
        <fieldset disabled={busy} className="m-0 min-w-0 space-y-5 border-0 p-0">
          <FormField id="email" label="Email">
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required className="h-11" />
          </FormField>
          <FormField id="password" label="Password">
            <PasswordInput id="password" name="password" autoComplete="current-password" placeholder="Masukkan password" required />
          </FormField>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" name="remember" defaultChecked />
              <Label htmlFor="remember" className="font-normal text-foreground">
                Ingat saya
              </Label>
            </div>
            <Link href="#" className="inline-block py-1.5 text-sm font-medium text-blue-600 hover:underline">
              Lupa password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="h-11 w-full rounded-full" isLoading={busy} loadingText="Mohon tunggu...">
            Masuk
          </Button>
          {busy && <FormProgress message={progress} />}
        </fieldset>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="inline-block py-1.5 font-semibold text-primary hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
