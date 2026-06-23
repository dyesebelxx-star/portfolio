import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getWorksByType } from "@/actions/work";
import { WorkCard } from "@/components/works/work-card";

export async function VideoWorks() {
  const works = await getWorksByType("video");

  if (works.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              视频作品
            </h2>
            <p className="text-muted-foreground">
              AI 驱动的视频类作品，包含AI短剧、恋综等
            </p>
          </div>
          <Link
            href="/works/videos"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            查看全部 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.slice(0, 6).map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/works/videos"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            查看全部视频作品 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
