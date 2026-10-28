"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LikertQuestion } from "@/features/asesmen/likert-question";
import { cn } from "@/lib/utils";
import { useAssessment } from "@/hooks/use-assessment";
import type { Question } from "@/types";

interface AssessmentRunnerProps {
  questions: Question[];
  perPage: number;
}

export function AssessmentRunner({ questions, perPage }: AssessmentRunnerProps) {
  const router = useRouter();
  const { saveResult } = useAssessment();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showErrors, setShowErrors] = useState(false);

  const totalPages = Math.ceil(questions.length / perPage);
  const pageQuestions = questions.slice(page * perPage, (page + 1) * perPage);
  const answeredCount = Object.keys(answers).length;
  const isLastPage = page === totalPages - 1;

  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  function answer(id: number, value: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function goTo(nextPage: number) {
    setShowErrors(false);
    setDirection(nextPage > page ? "next" : "prev");
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleNext() {
    const missing = pageQuestions.find((q) => answers[q.id] === undefined);
    if (missing) {
      setShowErrors(true);
      document.getElementById(`q-${missing.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!isLastPage) return goTo(page + 1);

    setSubmitting(true);
    try {
      await saveResult(questions, answers);
      toast.success("Tes selesai! Menghitung hasilmu…");
      router.push("/asesmen/hasil");
    } catch (error) {
      setSubmitting(false);
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan hasil asesmen.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="sticky top-20 z-30 rounded-2xl shadow-sm">
        <CardContent className="space-y-3 p-4 md:p-5">
          <div className="flex items-center justify-between text-sm">
            <p className="font-semibold">
              Halaman {page + 1} <span className="font-normal text-muted-foreground">dari {totalPages}</span>
            </p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              {answeredCount}/{questions.length} terjawab
            </p>
          </div>
          <Progress value={(answeredCount / questions.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div
        key={page}
        className={cn("animate-in space-y-4 duration-300 fade-in", direction === "next" ? "slide-in-from-right-4" : "slide-in-from-left-4")}
      >
        {pageQuestions.map((question, i) => (
          <LikertQuestion
            key={question.id}
            question={question}
            number={page * perPage + i + 1}
            value={answers[question.id]}
            invalid={showErrors && answers[question.id] === undefined}
            onChange={(value) => answer(question.id, value)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="lg" onClick={() => goTo(page - 1)} disabled={page === 0}>
          <ArrowLeft /> Sebelumnya
        </Button>
        <Button size="lg" onClick={handleNext} isLoading={submitting} loadingText="Mengirim jawaban...">
          {isLastPage ? "Lihat hasil" : "Berikutnya"} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
