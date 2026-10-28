interface FormProgressProps {
  message: string;
}

// Indikator proses yang tetap terlihat selama form dikirim dan halaman tujuan dimuat.
export function FormProgress({ message }: FormProgressProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-2 rounded-xl bg-secondary/60 p-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-progress-slide rounded-full bg-primary" />
      </div>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
