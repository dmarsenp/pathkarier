import { AppHeader } from "@/components/layout/app-header";
import { CareerPlansProvider } from "@/hooks/use-career-plans";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CareerPlansProvider>
      <div className="min-h-dvh">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pt-10">{children}</main>
      </div>
    </CareerPlansProvider>
  );
}
