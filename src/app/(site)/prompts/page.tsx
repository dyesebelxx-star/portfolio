import type { Metadata } from "next";
import { getPromptWorks } from "@/actions/work";
import { PromptGrid } from "@/components/prompts/prompt-grid";

export const metadata: Metadata = {
  title: "Prompt Library",
  description: "AI Prompt精选库 — 收录Midjourney、Stable Diffusion等平台的优质Prompt模板和工程实践。",
};

export default async function PromptsPage() {
  const works = await getPromptWorks();

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Prompt Library
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          收录了我在创作过程中使用和优化的优质 Prompt 模板，涵盖人物设计、场景构建、风格化等多个领域。
        </p>
      </div>

      <PromptGrid works={works} />
    </div>
  );
}
