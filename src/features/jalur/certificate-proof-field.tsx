"use client";

import { useState } from "react";
import { BadgeCheck, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CertificateProofFieldProps {
  certificateUrl: string | null;
  onSubmitCertificate: (url: string) => void;
  isSaving?: boolean;
}

// Bukti belajar berupa tautan sertifikat (mis. Coursera/Credly), bukan upload file,
// karena kuota database (free tier) sangat terbatas.
export function CertificateProofField({ certificateUrl, onSubmitCertificate, isSaving }: CertificateProofFieldProps) {
  const [value, setValue] = useState(certificateUrl ?? "");
  const [editing, setEditing] = useState(false);

  if (certificateUrl && !editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <BadgeCheck className="size-3.5 text-primary" />
        <a href={certificateUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
          Lihat bukti sertifikat
        </a>
        <button type="button" onClick={() => setEditing(true)} className="text-muted-foreground hover:underline">
          Ubah
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tempel link sertifikat (Coursera, Credly, dll.)"
        className="h-7 max-w-xs text-xs"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs"
        isLoading={isSaving}
        disabled={!value.trim()}
        onClick={() => {
          onSubmitCertificate(value.trim());
          setEditing(false);
        }}
      >
        Tandai sudah dapat sertifikat
      </Button>
    </div>
  );
}
