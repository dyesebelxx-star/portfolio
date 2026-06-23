"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Work, WorkSection, PromptItem, WorkflowStep } from "@/types";
import { cn } from "@/lib/utils";

export function WorkDetailContent({ work }: { work: Work }) {
  const allSections = work.sections && work.sections.length > 0
    ? work.sections
    : legacySections(work);
  // Filter out hidden sections for public display
  const sections = allSections.filter((s) => !s.hidden);
  const defaultTab = sections.length > 0 ? sections[0].id : "";

  return (
    <article className="container-page py-16 sm:py-20">
      {/* Cover Image */}
      <div className="relative aspect-video sm:aspect-[21/9] bg-muted rounded-2xl overflow-hidden mb-8">
        {work.coverImage ? (
          <Image
            src={work.coverImage}
            alt={work.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
            暂无封面图
          </div>
        )}
      </div>

      {/* Title & Meta */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge variant="secondary">{work.type === "video" ? "视频" : "图片"}</Badge>
          <Badge variant="outline">{work.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(work.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {work.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {work.description}
        </p>
        {work.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Video Embed (global, outside sections) */}
      {work.videoUrl && (
        <div className="mb-10">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <video
              src={work.videoUrl}
              controls
              className="absolute inset-0 w-full h-full"
              poster={work.coverImage}
            />
          </div>
        </div>
      )}

      {/* Dynamic Sections Tabs */}
      {sections.length > 0 && (
        <Tabs defaultValue={defaultTab} className="mb-12">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title || `区块 ${section.order + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-8">
              <SectionRenderer section={section} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </article>
  );
}

function SectionRenderer({ section }: { section: WorkSection }) {
  return (
    <>
      {/* Markdown */}
      {section.type === "markdown" && section.content && (
        <div className="prose-content max-w-none bg-card border border-border/40 rounded-xl p-6 sm:p-8">
          <ContentMarkdown content={section.content} />
        </div>
      )}

      {/* Images */}
      {section.type === "images" && section.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {section.images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-video bg-muted rounded-xl overflow-hidden"
            >
              <Image
                src={img}
                alt={`${section.title} - 图片 ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Prompts */}
      {section.type === "prompts" && (
        <div className="space-y-4">
          {section.prompts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              暂无 Prompt 信息
            </p>
          ) : (
            section.prompts.map((prompt, i) => (
              <PromptBlock key={i} prompt={prompt} index={i} />
            ))
          )}
        </div>
      )}

      {/* Steps */}
      {section.type === "steps" && (
        <div className="space-y-0">
          {section.steps.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              暂无流程信息
            </p>
          ) : (
            <div className="relative pl-8 border-l-2 border-border/60 space-y-8">
              {section.steps
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <div key={step.order} className="relative">
                    <div className="absolute -left-[29px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-card text-sm font-medium text-primary">
                      {step.order}
                    </div>
                    <h4 className="font-semibold mb-1.5">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    {step.imageUrl && (
                      <div className="relative aspect-video mt-3 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={step.imageUrl}
                          alt={step.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Build legacy sections from old fields for backward compatibility
function legacySections(work: Work): WorkSection[] {
  const sections: WorkSection[] = [];
  let order = 0;

  if (work.content) {
    sections.push({
      id: "legacy-content",
      title: "项目详情",
      type: "markdown" as const,
      content: work.content,
      images: [],
      prompts: [],
      steps: [],
      order: order++,
      hidden: false,
    });
  }

  if (work.images.length > 0) {
    sections.push({
      id: "legacy-images",
      title: "作品展示",
      type: "images" as const,
      content: "",
      images: work.images,
      prompts: [],
      steps: [],
      order: order++,
      hidden: false,
    });
  }

  if (work.summary) {
    sections.push({
      id: "legacy-summary",
      title: "项目总结",
      type: "markdown" as const,
      content: work.summary,
      images: [],
      prompts: [],
      steps: [],
      order: order++,
      hidden: false,
    });
  }

  if (work.prompts.length > 0) {
    sections.push({
      id: "legacy-prompts",
      title: "Prompt 展示",
      type: "prompts" as const,
      content: "",
      images: [],
      prompts: work.prompts,
      steps: [],
      order: order++,
      hidden: false,
    });
  }

  if (work.workflow.length > 0) {
    sections.push({
      id: "legacy-workflow",
      title: "创作流程",
      type: "steps" as const,
      content: "",
      images: [],
      prompts: [],
      steps: work.workflow,
      order: order++,
      hidden: false,
    });
  }

  return sections;
}

// Simple markdown renderer
function ContentMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-medium mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
          {items.map((item, j) => {
            const formatted = item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
            return (
              <li
                key={j}
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: formatted }}
              />
            );
          })}
        </ul>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !lines[i].startsWith("* ")) {
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ");
      const formatted = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      elements.push(
        <p
          key={i}
          className="mb-4 leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
  }

  return <>{elements}</>;
}

// Prompt block with copy functionality
function PromptBlock({
  prompt,
  index,
}: {
  prompt: PromptItem;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">
              #{index + 1}
            </span>
            <h4 className="font-medium">{prompt.title || "Untitled Prompt"}</h4>
          </div>
          {prompt.model && (
            <p className="text-xs text-muted-foreground">模型: {prompt.model}</p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "grid transition-all duration-200",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-3">
            <div className="relative">
              <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-96">
                {prompt.content}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            {prompt.notes && (
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">💡 技巧提示：</span>
                {prompt.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
