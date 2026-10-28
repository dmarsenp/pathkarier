"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  // Urutan tampil (0-5) agar elemen bersebelahan muncul berurutan.
  order?: number;
}

const DELAYS = ["", "delay-100", "delay-200", "delay-300", "delay-[400ms]", "delay-500"];

// Elemen memudar dan naik pelan saat pertama kali masuk layar. Tanpa IntersectionObserver langsung tampil.
export function Reveal({ children, className, order = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        DELAYS[Math.min(order, DELAYS.length - 1)],
        className,
      )}
    >
      {children}
    </div>
  );
}
