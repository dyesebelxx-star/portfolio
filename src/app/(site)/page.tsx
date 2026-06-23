import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedWorks } from "@/components/home/featured-works";
import { CategoryNav } from "@/components/home/category-nav";
import { Capabilities } from "@/components/home/capabilities";
import { ContactCTA } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="py-24" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<FeaturedWorksFallback />}>
        <FeaturedWorks />
      </Suspense>
      <CategoryNav />
      <Suspense fallback={<div className="py-20" />}>
        <Capabilities />
      </Suspense>
      <ContactCTA />
    </>
  );
}

function FeaturedWorksFallback() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mb-10">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-3" />
          <div className="h-5 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/60 overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-5 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
