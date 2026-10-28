import { cn } from "@/lib/utils";

// Penundaan bertahap ditulis sebagai string statis agar terdeteksi Tailwind (kelas dinamis tidak akan dibuat).
const STAGGER_DELAYS = [
  "",
  "[animation-delay:70ms]",
  "[animation-delay:140ms]",
  "[animation-delay:210ms]",
  "[animation-delay:280ms]",
  "[animation-delay:350ms]",
  "[animation-delay:420ms]",
];

export const ENTER = "animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both";

// Item daftar masuk satu per satu: item ke-n muncul sedikit setelah item sebelumnya.
export function enterStagger(index: number): string {
  return cn(ENTER, STAGGER_DELAYS[Math.min(index, STAGGER_DELAYS.length - 1)]);
}
