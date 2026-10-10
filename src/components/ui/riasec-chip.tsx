import { RIASEC_META } from "@/constants/riasec";
import { cn } from "@/lib/utils";
import type { RiasecDim } from "@/types";

interface RiasecChipProps {
  dim: RiasecDim;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "size-7 text-xs rounded-md",
  md: "size-9 text-sm rounded-lg",
  lg: "size-14 text-2xl rounded-xl",
};

export function RiasecChip({ dim, size = "md" }: RiasecChipProps) {
  return (
    <span
      title={RIASEC_META[dim].nama}
      className={cn("inline-grid shrink-0 place-items-center font-bold", RIASEC_META[dim].chip, SIZES[size])}
    >
      {dim}
    </span>
  );
}
