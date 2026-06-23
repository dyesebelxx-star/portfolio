"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createWork, updateWork } from "@/actions/work";
import { uploadImage, uploadVideo } from "@/actions/upload";
import type { Work, PromptItem, WorkflowStep } from "@/types";

interface WorkFormProps {
  work?: Work;
}

export function WorkForm({ work }: WorkFormProps) {
  const router = useRouter();
  const isEdit = !!work;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: work?.title || "",
    slug: work?.slug || "",
    type: work?.type || "image",
    category: work?.category || "其他",
    tags: work?.tags?.join(", ") || "",
    coverImage: work?.coverImage || "",
    description: work?.description || "",
    content: work?.content || "",
    images: work?.images || [],
    videoUrl: work?.videoUrl || "",
    summary: work?.summary || "",
    featured: work?.featured || false,
    published: work?.published || false,
  });

  const [prompts, setPrompts] = useState<PromptItem[]>(
    work?.prompts || []
  );
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(
    work?.workflow || []
  );

  function updateField(field: string, value: string | boolean | string[] | null) {
    if (value === null) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function generateSlug() {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, "-")
      .replace(/^-|-$/g, "") ||
      Date.now().toString(36);
    updateField("slug", slug);
  }

  async function handleFileUpload(file: File, type: "image" | "video" | "cover") {
    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);

    try {
      let result;
      if (type === "video") {
        result = await uploadVideo(formData);
      } else {
        result = await uploadImage(formData);
      }

      if ("error" in result) {
        toast.error(result.error);
      } else {
        if (type === "cover") {
          updateField("coverImage", result.url);
        } else if (type === "video") {
          updateField("videoUrl", result.url);
        }
        toast.success("上传成功");
      }
    } catch {
      toast.error("上传失败");
    } finally {
      setUploading(null);
    }
  }

  function addPrompt() {
    setPrompts([...prompts, { title: "", content: "", model: "", notes: "" }]);
  }

  function updatePrompt(index: number, field: keyof PromptItem, value: string) {
    const updated = [...prompts];
    updated[index] = { ...updated[index], [field]: value };
    setPrompts(updated);
  }

  function removePrompt(index: number) {
    setPrompts(prompts.filter((_, i) => i !== index));
  }

  function addStep() {
    setWorkflow([
      ...workflow,
      { order: workflow.length + 1, title: "", description: "" },
    ]);
  }

  function updateStep(index: number, field: keyof WorkflowStep, value: string | number) {
    const updated = [...workflow];
    updated[index] = { ...updated[index], [field]: value as never };
    setWorkflow(updated);
  }

  function removeStep(index: number) {
    const updated = workflow.filter((_, i) => i !== index);
    // Re-index
    setWorkflow(updated.map((s, i) => ({ ...s, order: i + 1 })));
  }

  function moveStep(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workflow.length) return;
    const updated = [...workflow];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setWorkflow(updated.map((s, i) => ({ ...s, order: i + 1 })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        slug: form.slug || Date.now().toString(36),
        title: form.title,
        type: form.type as "video" | "image",
        category: form.category as Work["category"],
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        coverImage: form.coverImage,
        description: form.description,
        content: form.content,
        images: form.images,
        videoUrl: form.videoUrl || null,
        prompts,
        workflow,
        summary: form.summary,
        featured: form.featured,
        published: form.published,
      };

      if (isEdit && work) {
        await updateWork(work.id, data);
        toast.success("作品已更新");
      } else {
        await createWork(data);
        toast.success("作品已创建");
      }
      router.push("/admin/works");
      router.refresh();
    } catch {
      toast.error("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="font-semibold">基本信息</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">标题 *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="作品标题"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug{" "}
              <button
                type="button"
                onClick={generateSlug}
                className="text-xs text-primary hover:underline"
              >
                自动生成
              </button>
            </Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="url-friendly-slug"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">类型</Label>
            <Select
              value={form.type}
              onValueChange={(v) => updateField("type", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">视频</SelectItem>
                <SelectItem value="image">图片</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">分类</Label>
            <Select
              value={form.category}
              onValueChange={(v) => updateField("category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AI短剧">AI短剧</SelectItem>
                <SelectItem value="恋综">恋综</SelectItem>
                <SelectItem value="人物设计">人物设计</SelectItem>
                <SelectItem value="场景设计">场景设计</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">标签（逗号分隔）</Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="AI视频, 恋综, Midjourney"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">简介 *</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="简短介绍，用于卡片展示"
            rows={2}
            required
          />
        </div>
      </section>

      <Separator />

      {/* Cover & Media */}
      <section className="space-y-4">
        <h3 className="font-semibold">封面与媒体</h3>
        <div className="space-y-2">
          <Label>封面图</Label>
          <div className="flex gap-3">
            <Input
              value={form.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              placeholder="/uploads/covers/xxx.jpg 或 URL"
              className="flex-1"
            />
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:bg-muted cursor-pointer">
              {uploading === "cover" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              上传
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "cover");
                }}
              />
            </label>
          </div>
        </div>
        {form.type === "video" && (
          <div className="space-y-2">
            <Label>视频 URL</Label>
            <div className="flex gap-3">
              <Input
                value={form.videoUrl}
                onChange={(e) => updateField("videoUrl", e.target.value)}
                placeholder="视频链接或上传"
                className="flex-1"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:bg-muted cursor-pointer">
                {uploading === "video" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                上传
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "video");
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* Content */}
      <section className="space-y-4">
        <h3 className="font-semibold">详细内容（Markdown）</h3>
        <Textarea
          value={form.content}
          onChange={(e) => updateField("content", e.target.value)}
          placeholder="## 项目概述&#10;&#10;项目详细介绍...&#10;&#10;## 创作亮点&#10;&#10;- 亮点1&#10;- 亮点2"
          rows={10}
          className="font-mono text-sm"
        />
      </section>

      <Separator />

      {/* Images */}
      <section className="space-y-4">
        <h3 className="font-semibold">图片列表（每行一个URL）</h3>
        <Textarea
          value={form.images.join("\n")}
          onChange={(e) =>
            updateField("images", e.target.value.split("\n").filter(Boolean))
          }
          placeholder="/uploads/images/img1.jpg&#10;/uploads/images/img2.jpg"
          rows={4}
        />
      </section>

      <Separator />

      {/* Prompts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Prompt 列表</h3>
          <Button type="button" variant="outline" size="sm" onClick={addPrompt}>
            <Plus className="h-4 w-4 mr-1" /> 添加 Prompt
          </Button>
        </div>
        {prompts.map((prompt, i) => (
          <div key={i} className="border border-border/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Prompt #{i + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removePrompt(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input
              placeholder="Prompt 标题"
              value={prompt.title}
              onChange={(e) => updatePrompt(i, "title", e.target.value)}
            />
            <Textarea
              placeholder="Prompt 内容"
              value={prompt.content}
              onChange={(e) => updatePrompt(i, "content", e.target.value)}
              rows={3}
              className="font-mono text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="使用的模型"
                value={prompt.model}
                onChange={(e) => updatePrompt(i, "model", e.target.value)}
              />
              <Input
                placeholder="备注/技巧"
                value={prompt.notes}
                onChange={(e) => updatePrompt(i, "notes", e.target.value)}
              />
            </div>
          </div>
        ))}
      </section>

      <Separator />

      {/* Workflow */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">创作流程</h3>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" /> 添加步骤
          </Button>
        </div>
        {workflow.map((step, i) => (
          <div key={i} className="border border-border/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                步骤 {step.order}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveStep(i, "up")}
                  disabled={i === 0}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveStep(i, "down")}
                  disabled={i === workflow.length - 1}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeStep(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <Input
              placeholder="步骤标题"
              value={step.title}
              onChange={(e) => updateStep(i, "title", e.target.value)}
            />
            <Textarea
              placeholder="步骤描述"
              value={step.description}
              onChange={(e) => updateStep(i, "description", e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </section>

      <Separator />

      {/* Summary */}
      <section className="space-y-4">
        <h3 className="font-semibold">项目总结</h3>
        <Textarea
          value={form.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="项目总结..."
          rows={4}
        />
      </section>

      <Separator />

      {/* Settings */}
      <section className="space-y-4">
        <h3 className="font-semibold">发布设置</h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="featured">亮点标记</Label>
            <p className="text-xs text-muted-foreground">标记为亮点作品（可用于特定展示场景）</p>
          </div>
          <Switch
            id="featured"
            checked={form.featured}
            onCheckedChange={(v) => updateField("featured", v)}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor="published">发布状态</Label>
            <p className="text-xs text-muted-foreground">发布后公开可见</p>
          </div>
          <Switch
            id="published"
            checked={form.published}
            onCheckedChange={(v) => updateField("published", v)}
          />
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={saving} className="rounded-full px-8">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isEdit ? "保存更改" : "创建作品"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-full"
        >
          取消
        </Button>
      </div>
    </form>
  );
}
