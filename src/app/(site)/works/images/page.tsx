import type { Metadata } from "next";
import { getWorksByType } from "@/actions/work";
import { WorkCard } from "@/components/works/work-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI图片作品",
  description: "AI生成的图片作品集，包括人物设计、场景设计、时装系列等创意图片项目。",
};

export default async function ImagesPage() {
  const works = await getWorksByType("image");

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          AI 图片作品
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          人物设计、场景设计、创意视觉 — 探索AI图像生成的无限可能性
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
          <p className="text-muted-foreground text-lg">暂无图片作品</p>
        </div>
      )}
    </div>
  );
}
