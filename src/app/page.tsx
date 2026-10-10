import { PublicHeader } from "@/components/layout/public-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/features/landing/hero";
import { Highlights } from "@/features/landing/highlights";
import { HowItWorks } from "@/features/landing/how-it-works";

export default function LandingPage() {
  return (
    <>
      <PublicHeader />
      <main>
        <Hero />
        <Highlights />
        <HowItWorks />
      </main>
      <SiteFooter />
    </>
  );
}
