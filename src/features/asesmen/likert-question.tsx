"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LIKERT_OPTIONS } from "@/constants/riasec";
import { cn } from "@/lib/utils";
import type { Question } from "@/types";

const CIRCLE_SIZES = ["size-11", "size-9", "size-8", "size-9", "size-11"];

interface LikertQuestionProps {
  question: Question;
  number: number;
  value?: number;
  invalid: boolean;
  onChange: (value: number) => void;
}

export function LikertQuestion({ question, number, value, invalid, onChange }: LikertQuestionProps) {
  const groupId = `q-${question.id}`;

  return (
    <fieldset
      id={groupId}
      className={cn(
        "scroll-mt-28 space-y-5 rounded-2xl border bg-card p-5 transition-colors md:p-6",
        value !== undefined && "border-primary/30",
        invalid && "border-destructive/60 bg-destructive/5",
      )}
    >
      <legend className="sr-only">Pernyataan {number}</legend>
      <p className="font-medium md:text-lg">
        <span className="mr-2 text-muted-foreground">{number}.</span>
        {question.teks}
      </p>
      <RadioGroup
        value={value ? String(value) : ""}
        onValueChange={(v) => onChange(Number(v))}
        className="flex items-center justify-between gap-1 sm:justify-center sm:gap-6"
        aria-label={question.teks}
      >
        {LIKERT_OPTIONS.map((option, i) => (
          <Label
            key={option.value}
            htmlFor={`${groupId}-${option.value}`}
            className="flex w-14 cursor-pointer flex-col items-center gap-2 text-center sm:w-20"
          >
            <RadioGroupItem id={`${groupId}-${option.value}`} value={String(option.value)} className="peer sr-only" />
            <span
              className={cn(
                "grid place-items-center rounded-full border-2 border-primary/30 transition-all hover:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-data-[state=checked]:scale-110 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary",
                CIRCLE_SIZES[i],
              )}
            />
            <span className="text-[11px] font-normal leading-tight text-muted-foreground sm:text-xs">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>
      {invalid && <p className="text-center text-xs font-medium text-destructive">Pernyataan ini belum dijawab.</p>}
    </fieldset>
  );
}
