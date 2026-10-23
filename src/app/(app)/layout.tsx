import { AppHeader } from "@/components/layout/app-header";
import { AssessmentProvider } from "@/hooks/use-assessment";
import { CareerPlansProvider } from "@/hooks/use-career-plans";
import { CareersProvider } from "@/hooks/use-careers";
import { UserSkillsProvider } from "@/hooks/use-user-skills";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CareersProvider>
      <AssessmentProvider>
        <UserSkillsProvider>
          <CareerPlansProvider>
            <div className="min-h-dvh">
              <AppHeader />
              <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pt-10">{children}</main>
            </div>
          </CareerPlansProvider>
        </UserSkillsProvider>
      </AssessmentProvider>
    </CareersProvider>
  );
}
