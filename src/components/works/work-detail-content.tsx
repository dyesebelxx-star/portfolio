"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Work } from "@/types";
import { cn } from "@/lib/utils";

export function WorkDetailContent({ work }: { work: Work }) {
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

      {/* Tabs: Content / Prompts / Workflow */}
      <Tabs defaultValue="content" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="content">项目详情</TabsTrigger>
          <TabsTrigger value="prompts">
            Prompt 展示 ({work.prompts.length})
          </TabsTrigger>
          <TabsTrigger value="workflow">创作流程</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-8">
          {/* Text content (Markdown rendered) */}
          {work.content && (
            <div className="prose-content max-w-none bg-card border border-border/40 rounded-xl p-6 sm:p-8">
              <ContentMarkdown content={work.content} />
            </div>
          )}

          {/* Image Gallery */}
          {work.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">作品展示</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {work.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-video bg-muted rounded-xl overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`${work.title} - 图片 ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Embed */}
          {work.videoUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-4">视频展示</h3>
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

          {/* Summary */}
          {work.summary && (
            <div>
              <Separator className="mb-6" />
              <h3 className="text-lg font-semibold mb-3">项目总结</h3>
              <p className="text-muted-foreground leading-relaxed">
                {work.summary}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          {work.prompts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              暂无 Prompt 信息
            </p>
          ) : (
            work.prompts.map((prompt, i) => (
              <PromptBlock key={i} prompt={prompt} index={i} />
            ))
          )}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-0">
          {work.workflow.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              暂无创作流程信息
            </p>
          ) : (
            <div className="relative pl-8 border-l-2 border-border/60 space-y-8">
              {work.workflow
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
        </TabsContent>
      </Tabs>
    </article>
  );
}

// Simple markdown renderer (no external dependency needed for basic markdown)
function ContentMarkdown({ content }: { content: string }) {
  // Split by headings and paragraphs
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-medium mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // List items
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
          {items.map((item, j) => {
            // Handle bold text
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

    // Paragraph (collect consecutive non-empty lines)
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
  prompt: { title: string; content: string; model: string; notes: string };
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
            <h4 className="font-medium">{prompt.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground">模型: {prompt.model}</p>
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
