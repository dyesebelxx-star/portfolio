import type { Metadata } from "next";
import { getWorksByType } from "@/actions/work";
import { WorkCard } from "@/components/works/work-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI短视频作品",
  description: "AI生成的短视频作品集，包括AI短剧、恋综等创意视频项目。",
};

export default async function VideosPage() {
  const works = await getWorksByType("video");

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          AI 短视频作品
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          AI短剧、恋综、创意视频 — 全程AI驱动的视频内容创作项目
        </p>
      </div>

      {works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">暂无视频作品</p>
        </div>
      )}
    </div>
  );
}
