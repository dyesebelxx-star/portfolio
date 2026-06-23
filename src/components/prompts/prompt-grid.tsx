"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Copy, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PromptItem, Work } from "@/types";

interface PromptWork extends Pick<Work, "slug" | "title" | "type" | "category" | "tags" | "coverImage" | "description"> {
  prompts: PromptItem[];
}

export function PromptGrid({ works }: { works: PromptWork[] }) {
  const [search, setSearch] = useState("");

  // Flatten all prompts from all works
  const allPrompts = works.flatMap((work) =>
    work.prompts.map((prompt) => ({
      ...prompt,
      workSlug: work.slug,
      workTitle: work.title,
      workType: work.type,
      workCategory: work.category,
    }))
  );

  const filtered = search
    ? allPrompts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.content.toLowerCase().includes(search.toLowerCase()) ||
          p.model.toLowerCase().includes(search.toLowerCase()) ||
          p.notes.toLowerCase().includes(search.toLowerCase())
      )
    : allPrompts;

  return (
    <div>
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索 Prompt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">未找到匹配的 Prompt</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((prompt, i) => (
            <PromptCard key={`${prompt.workSlug}-${i}`} prompt={prompt} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function PromptCard({
  prompt,
  index,
}: {
  prompt: {
    title: string;
    content: string;
    model: string;
    notes: string;
    workSlug: string;
    workTitle: string;
    workType: string;
    workCategory: string;
  };
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
    <Card className="border border-border/60 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs font-mono text-muted-foreground">
              #{index + 1}
            </span>
            <h3 className="font-medium text-sm sm:text-base">
              {prompt.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs font-normal">
              {prompt.model}
            </Badge>
            <span className="text-xs text-muted-foreground">
              from{" "}
              <Link
                href={`/works/${prompt.workSlug}`}
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {prompt.workTitle}
              </Link>
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
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
              <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-80">
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
            <div className="flex justify-end">
              <Link
                href={`/works/${prompt.workSlug}`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                查看完整项目 <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
