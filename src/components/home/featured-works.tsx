import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedWorks } from "@/actions/work";
import { WorkCard } from "@/components/works/work-card";

export async function FeaturedWorks() {
  const works = await getFeaturedWorks();

  if (works.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              精选作品
            </h2>
            <p className="text-muted-foreground">
              近期最具代表性的 AI 创作项目
            </p>
          </div>
          <Link
            href="/works"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            查看全部 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/works"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            查看全部作品 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
