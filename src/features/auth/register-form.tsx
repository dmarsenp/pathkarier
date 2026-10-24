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

interface RegisterErrors {
  password?: string;
  confirm?: string;
  consent?: string;
}

function validate(form: FormData, consent: boolean): RegisterErrors {
  const password = String(form.get("password") ?? "");
  const errors: RegisterErrors = {};
  if (password.length < 8) errors.password = "Password minimal 8 karakter.";
  if (password !== form.get("confirm")) errors.confirm = "Konfirmasi password belum sama.";
  if (!consent) errors.consent = "Centang persetujuan untuk melanjutkan.";
  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  // FR-01: registrasi akun, lalu langsung login agar pengguna masuk ke sesi aktif.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = validate(form, consent);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const payload = { name: form.get("nama"), email: form.get("email"), password: form.get("password") };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      toast.error(data.error ?? "Gagal membuat akun. Coba lagi.");
      return;
    }

    const result = await signIn("credentials", { email: payload.email, password: payload.password, redirect: false });
    setLoading(false);
    if (result?.error) {
      toast.error("Akun dibuat, tapi gagal masuk otomatis. Silakan login.");
      router.push("/login");
      return;
    }
    router.push("/profil");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary md:text-[clamp(1.3rem,2.1vw,1.9rem)]">Buat akun</h1>
        <p className="text-sm text-muted-foreground">Mulai perjalanan kariermu dengan mengenal potensimu lebih baik.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id="nama" label="Nama lengkap">
          <Input id="nama" name="nama" autoComplete="name" placeholder="Nama sesuai identitas" required className="h-11" />
        </FormField>
        <FormField id="email" label="Email">
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required className="h-11" />
        </FormField>
        <FormField id="password" label="Password" hint="Minimal 8 karakter." error={errors.password}>
          <PasswordInput id="password" name="password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
        </FormField>
        <FormField id="confirm" label="Ulangi password" error={errors.confirm}>
          <PasswordInput id="confirm" name="confirm" autoComplete="new-password" aria-invalid={Boolean(errors.confirm)} />
        </FormField>
        {/* KEPUTUSAN #10: persetujuan data penelitian saat registrasi */}
        <div className="space-y-1.5 rounded-lg border bg-muted/50 p-3">
          <div className="flex items-start gap-3">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
            <Label htmlFor="consent" className="text-sm font-normal leading-relaxed text-muted-foreground">
              Saya setuju data saya digunakan untuk penelitian dan uji kegunaan, sesuai{" "}
              <Link href="#" className="font-medium text-primary hover:underline">
                Kebijakan Privasi
              </Link>
              .
            </Label>
          </div>
          {errors.consent && <p className="pl-7 text-xs font-medium text-destructive">{errors.consent}</p>}
        </div>
        <Button type="submit" size="lg" className="h-11 w-full rounded-full" isLoading={loading} loadingText="Membuat akun...">
          Buat akun
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
