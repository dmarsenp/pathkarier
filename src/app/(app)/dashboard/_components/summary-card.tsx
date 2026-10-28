import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}

export function SummaryCard({ title, href, linkLabel, children }: SummaryCardProps) {
  return (
    <Card className="flex flex-col rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex-1">{children}</div>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {linkLabel} <ChevronRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
