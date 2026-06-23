"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Copy, Check, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Work, WorkSection, PromptItem, ImageItem } from "@/types";
import { cn } from "@/lib/utils";

export function WorkDetailContent({ work }: { work: Work }) {
  const allSections = work.sections && work.sections.length > 0
    ? work.sections
    : legacySections(work);
  const visibleSections = allSections.filter((s) => !s.hidden);

  // Separate image sections (for the gallery layout) from other sections
  const imageSections = visibleSections.filter((s) => s.type === "images" && s.images.length > 0);
  const otherSections = visibleSections.filter((s) => s.type !== "images" || s.images.length === 0);

  // Collect all images from all image sections into one flat list with section context
  const allImages: (ImageItem & { sectionTitle: string; sectionId: string })[] = [];
  for (const sec of imageSections) {
    for (const img of sec.images) {
      allImages.push({ ...img, sectionTitle: sec.title, sectionId: sec.id });
    }
  }

  const isImageWork = work.type === "image";
  const isVideoWork = work.type === "video";

  return (
    <article className="container-page py-16 sm:py-20">
      {/* Cover Image — smaller for image works that have gallery */}
      <div
        className={cn(
          "relative bg-muted rounded-2xl overflow-hidden mb-8",
          isImageWork && allImages.length > 0
            ? "aspect-[21/9] sm:aspect-[21/9]"
            : "aspect-video sm:aspect-[21/9]"
        )}
      >
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

      {/* === IMAGE WORK: Gallery + Prompt two-column layout === */}
      {isImageWork && allImages.length > 0 && (
        <ImageGallery images={allImages} workTitle={work.title} />
      )}

      {/* === VIDEO WORK: Centered video player === */}
      {isVideoWork && work.videoUrl && (
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={work.videoUrl}
                controls
                className="absolute inset-0 w-full h-full"
                poster={work.coverImage}
                preload="metadata"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video work without videoUrl — show cover as placeholder */}
      {isVideoWork && !work.videoUrl && (
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
              {work.coverImage ? (
                <Image
                  src={work.coverImage}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
                  <Play className="h-16 w-16" />
                  <span className="text-sm">暂无视频</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other Sections (markdown, prompts, steps) in tabs */}
      {otherSections.length > 0 && (
        <Tabs defaultValue={otherSections[0].id} className="mb-12">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {otherSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title || `区块 ${section.order + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {otherSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-8">
              <SectionRenderer section={section} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </article>
  );
}

/* ───────────────── Image Gallery: two-column layout ───────────────── */
function ImageGallery({
  images,
  workTitle,
}: {
  images: (ImageItem & { sectionTitle: string; sectionId: string })[];
  workTitle: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = images[currentIndex];

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  function goTo(index: number) {
    setCurrentIndex(index);
  }

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  return (
    <div className="mb-12">
      {/* Section header */}
      <h2 className="text-xl font-semibold mb-4">作品展示</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Image viewer with navigation */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main image */}
          <div className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden border border-border/40">
            {current.url ? (
              <Image
                src={current.url}
                alt={`${workTitle} - 图片 ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={currentIndex === 0}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                暂无图片
              </div>
            )}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prev}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一张
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={next}
              className="rounded-full"
            >
              下一张
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                    i === currentIndex
                      ? "border-primary ring-1 ring-primary"
                      : "border-border/40 hover:border-border opacity-60 hover:opacity-100"
                  )}
                >
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={`缩略图 ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Prompt info panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-card border border-border/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground">
                图片信息
              </h3>
              <span className="text-xs text-muted-foreground/70">
                {current.sectionTitle} · #{currentIndex + 1}
              </span>
            </div>

            {current.prompt ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium">
                  🎨 Prompt
                </p>
                <div className="relative">
                  <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-80">
                    {current.prompt}
                  </pre>
                  <CopyButton text={current.prompt} />
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground/50 text-sm">
                暂无 Prompt 信息
              </div>
            )}

            {/* Keyboard hint */}
            <p className="text-xs text-muted-foreground/50">
              使用 ← → ↑ ↓ 方向键切换图片
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Copy button ───────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
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
  );
}

/* ───────────────── Section Renderer ───────────────── */
function SectionRenderer({ section }: { section: WorkSection }) {
  return (
    <>
      {/* Markdown */}
      {section.type === "markdown" && section.content && (
        <div className="prose-content max-w-none bg-card border border-border/40 rounded-xl p-6 sm:p-8">
          <ContentMarkdown content={section.content} />
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
