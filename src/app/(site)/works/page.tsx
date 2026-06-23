import { Suspense } from "react";
import type { Metadata } from "next";
import { WorkFilter } from "@/components/works/work-filter";
import { WorkCard } from "@/components/works/work-card";
import { getAllWorks } from "@/actions/work";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "作品展示",
  description: "浏览AI内容创作作品：AI视频、AI图片、Prompt工程等精选作品合集。",
};

interface WorksPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const works = await getAllWorks({
    type: params.type,
    category: params.category,
    search: params.search,
  });

  return (
    <div className="container-page py-16 sm:py-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          作品展示
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          浏览我的AI内容创作作品集，包括AI视频、AI图片、Prompt工程等各类项目
        </p>
      </div>

      {/* Filter */}
      <div className="mb-8">
        <Suspense>
          <WorkFilter />
        </Suspense>
      </div>

      {/* Grid */}
      {works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">暂无作品</p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            请尝试调整筛选条件
          </p>
        </div>
      )}
    </div>
  );
}
