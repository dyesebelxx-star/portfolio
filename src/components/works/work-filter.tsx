"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function WorkFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";

  function updateFilters(key: string, value: string | null) {
    if (value === null) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/works?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索作品..."
          value={currentSearch}
          onChange={(e) => updateFilters("search", e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={currentType}
        onValueChange={(v) => updateFilters("type", v === "all" ? "" : (v ?? ""))}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部类型</SelectItem>
          <SelectItem value="video">视频</SelectItem>
          <SelectItem value="image">图片</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={currentCategory}
        onValueChange={(v) => updateFilters("category", v === "all" ? "" : (v ?? ""))}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部分类</SelectItem>
          <SelectItem value="AI短剧">AI短剧</SelectItem>
          <SelectItem value="恋综">恋综</SelectItem>
          <SelectItem value="人物设计">人物设计</SelectItem>
          <SelectItem value="场景设计">场景设计</SelectItem>
          <SelectItem value="其他">其他</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
