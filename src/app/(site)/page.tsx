import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ImageWorks } from "@/components/home/image-works";
import { VideoWorks } from "@/components/home/video-works";
import { Capabilities } from "@/components/home/capabilities";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="py-24" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<WorksFallback />}>
        <ImageWorks />
      </Suspense>
      <Suspense fallback={<WorksFallback />}>
        <VideoWorks />
      </Suspense>
      <Suspense fallback={<div className="py-20" />}>
        <Capabilities />
      </Suspense>
    </>
  );
}

function WorksFallback() {
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
