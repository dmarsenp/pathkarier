"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/features/auth/password-input";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // FR-02: pesan gagal generik, tidak membocorkan field yang salah (email terdaftar atau password salah).
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Email atau password salah.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary md:text-[clamp(1.3rem,2.1vw,1.9rem)]">Selamat datang kembali</h1>
        <p className="text-sm text-muted-foreground">Lanjutkan perjalananmu menuju karier yang sesuai dengan potensimu.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
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
          <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
            Lupa password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="h-11 w-full rounded-full" isLoading={loading} loadingText="Memeriksa...">
          Masuk
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
