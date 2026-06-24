"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Upload, GripVertical, Eye, EyeOff } from "lucide-react";
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
import { uploadImage, uploadVideo, uploadCover as uploadCoverAction } from "@/actions/upload";
import type { Work, PromptItem, WorkflowStep, WorkSection, ImageItem } from "@/types";

interface WorkFormProps {
  work?: Work;
}

const SECTION_TYPES = [
  { value: "markdown", label: "富文本" },
  { value: "images", label: "图片集" },
  { value: "prompts", label: "Prompt 列表" },
  { value: "steps", label: "步骤流程" },
];

function makeSectionId() {
  return `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptySection(type: WorkSection["type"], order: number): WorkSection {
  return {
    id: makeSectionId(),
    title: "",
    type,
    content: "",
    images: [],
    prompts: [],
    steps: [],
    order,
    hidden: false,
  };
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
    category: work?.category || "",
    tags: work?.tags?.join(", ") || "",
    coverImage: work?.coverImage || "",
    description: work?.description || "",
    videoUrl: work?.videoUrl || "",
    featured: work?.featured || false,
    published: work?.published || false,
  });

  const [sections, setSections] = useState<WorkSection[]>(
    work?.sections && work.sections.length > 0
      ? work.sections
      : work
        ? legacyToSections(work)
        : []
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
      } else if (type === "cover") {
        result = await uploadCoverAction(formData);
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

  // Section operations
  function addSection(type: WorkSection["type"]) {
    setSections((prev) => [
      ...prev,
      emptySection(type, prev.length),
    ]);
  }

  function removeSection(index: number) {
    setSections((prev) =>
      prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }))
    );
  }

  function moveSection(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    setSections((prev) => {
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated.map((s, i) => ({ ...s, order: i }));
    });
  }

  function updateSection(index: number, field: keyof WorkSection, value: unknown) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        // If type changed, reset content fields
        if (field === "type" && value !== s.type) {
          return emptySection(value as WorkSection["type"], s.order);
        }
        return { ...s, [field]: value };
      })
    );
  }

  function toggleSectionHidden(index: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, hidden: !s.hidden } : s
      )
    );
  }

  // Image item operations inside a section
  function addImage(sectionIndex: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        return {
          ...s,
          images: [...s.images, { url: "", prompt: "" }],
        };
      })
    );
  }

  function updateImage(sectionIndex: number, imageIndex: number, field: keyof ImageItem, value: string) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const updated = [...s.images];
        updated[imageIndex] = { ...updated[imageIndex], [field]: value };
        return { ...s, images: updated };
      })
    );
  }

  function removeImage(sectionIndex: number, imageIndex: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        return { ...s, images: s.images.filter((_, j) => j !== imageIndex) };
      })
    );
  }

  function moveImage(sectionIndex: number, imageIndex: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? imageIndex - 1 : imageIndex + 1;
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        if (newIndex < 0 || newIndex >= s.images.length) return s;
        const updated = [...s.images];
        [updated[imageIndex], updated[newIndex]] = [updated[newIndex], updated[imageIndex]];
        return { ...s, images: updated };
      })
    );
  }

  async function handleImageUpload(sectionIndex: number, imageIndex: number, file: File) {
    setUploading(`img_${sectionIndex}_${imageIndex}`);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await uploadImage(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        updateImage(sectionIndex, imageIndex, "url", result.url);
        toast.success("上传成功");
      }
    } catch {
      toast.error("上传失败");
    } finally {
      setUploading(null);
    }
  }

  // Prompt operations inside a section
  function addPrompt(sectionIndex: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        return {
          ...s,
          prompts: [...s.prompts, { title: "", content: "", model: "", notes: "" }],
        };
      })
    );
  }

  function updatePrompt(sectionIndex: number, promptIndex: number, field: keyof PromptItem, value: string) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const updated = [...s.prompts];
        updated[promptIndex] = { ...updated[promptIndex], [field]: value };
        return { ...s, prompts: updated };
      })
    );
  }

  function removePrompt(sectionIndex: number, promptIndex: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        return { ...s, prompts: s.prompts.filter((_, j) => j !== promptIndex) };
      })
    );
  }

  // Workflow steps operations inside a section
  function addStep(sectionIndex: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        return {
          ...s,
          steps: [...s.steps, { order: s.steps.length + 1, title: "", description: "" }],
        };
      })
    );
  }

  function updateStep(sectionIndex: number, stepIndex: number, field: keyof WorkflowStep, value: string | number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const updated = [...s.steps];
        updated[stepIndex] = { ...updated[stepIndex], [field]: value as never };
        return { ...s, steps: updated };
      })
    );
  }

  function removeStep(sectionIndex: number, stepIndex: number) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const filtered = s.steps.filter((_, j) => j !== stepIndex);
        return {
          ...s,
          steps: filtered.map((st, k) => ({ ...st, order: k + 1 })),
        };
      })
    );
  }

  function moveStep(sectionIndex: number, stepIndex: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        if (newIndex < 0 || newIndex >= s.steps.length) return s;
        const updated = [...s.steps];
        [updated[stepIndex], updated[newIndex]] = [updated[newIndex], updated[stepIndex]];
        return {
          ...s,
          steps: updated.map((st, k) => ({ ...st, order: k + 1 })),
        };
      })
    );
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
        content: "",
        images: [],
        videoUrl: form.videoUrl || null,
        prompts: [],
        workflow: [],
        summary: "",
        sections,
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
    } catch (err) {
      console.error("保存作品失败:", err);
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
            <Label htmlFor="category">分类（自由输入）</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="例如：AI短剧、人物设计、或自定义分类"
            />
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
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:bg-muted cursor-pointer">
              {uploading === "cover" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {form.coverImage ? "重新上传封面" : "上传封面"}
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
            {form.coverImage && (
              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                ✓ 已上传
              </span>
            )}
          </div>
          {form.coverImage && (
            <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-muted border border-border/40">
              <Image
                src={form.coverImage}
                alt="封面预览"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          )}
        </div>
        {form.type === "video" && (
          <div className="space-y-2">
            <Label>视频文件</Label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:bg-muted cursor-pointer">
                {uploading === "video" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {form.videoUrl ? "重新上传视频" : "上传视频"}
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
              {form.videoUrl && (
                <span className="text-xs text-muted-foreground">
                  ✓ 已上传
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* Dynamic Sections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">内容区块</h3>
          <DropdownAddSection onAdd={addSection} />
        </div>

        {sections.length === 0 && (
          <div className="text-center py-8 border border-dashed border-border/60 rounded-xl">
            <p className="text-muted-foreground text-sm mb-3">
              尚未添加内容区块
            </p>
            <DropdownAddSection onAdd={addSection} />
          </div>
        )}

        {sections.map((section, i) => (
          <div
            key={section.id}
            className={`border border-border/60 rounded-xl p-4 space-y-4 ${
              section.hidden ? "opacity-60 border-dashed bg-muted/30" : ""
            }`}
          >
            {/* Section header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => moveSection(i, "up")}
                  disabled={i === 0}
                  className="p-0.5 hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(i, "down")}
                  disabled={i === sections.length - 1}
                  className="p-0.5 hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <GripVertical className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-xs font-mono text-muted-foreground">
                #{i + 1}
              </span>
              <Input
                placeholder="区块标题"
                value={section.title}
                onChange={(e) => updateSection(i, "title", e.target.value)}
                className="flex-1 h-8 text-sm font-medium"
              />
              <Select
                value={section.type}
                onValueChange={(v) => updateSection(i, "type", v)}
              >
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => toggleSectionHidden(i)}
                title={section.hidden ? "已隐藏，点击显示" : "可见，点击隐藏"}
              >
                {section.hidden ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removeSection(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Section content based on type */}
            {section.type === "markdown" && (
              <Textarea
                value={section.content}
                onChange={(e) => updateSection(i, "content", e.target.value)}
                placeholder="Markdown 内容..."
                rows={6}
                className="font-mono text-sm"
              />
            )}

            {section.type === "images" && (
              <div className="space-y-3">
                {section.images.map((img, ii) => (
                  <div
                    key={ii}
                    className="border border-border/40 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        图片 #{ii + 1}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveImage(i, ii, "up")}
                          disabled={ii === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveImage(i, ii, "down")}
                          disabled={ii === section.images.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeImage(i, ii)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-border text-xs hover:bg-muted cursor-pointer">
                        {uploading === `img_${i}_${ii}` ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                        {img.url ? "重新上传" : "上传图片"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(i, ii, file);
                          }}
                        />
                      </label>
                      {img.url ? (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          ✓ 已上传
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          请上传图片
                        </span>
                      )}
                    </div>
                    <Textarea
                      placeholder="图片对应的 Prompt（可选）"
                      value={img.prompt}
                      onChange={(e) =>
                        updateImage(i, ii, "prompt", e.target.value)
                      }
                      rows={2}
                      className="text-sm font-mono"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addImage(i)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> 添加图片
                </Button>
              </div>
            )}

            {section.type === "prompts" && (
              <div className="space-y-3">
                {section.prompts.map((prompt, pi) => (
                  <div
                    key={pi}
                    className="border border-border/40 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Prompt #{pi + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removePrompt(i, pi)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Prompt 标题"
                      value={prompt.title}
                      onChange={(e) =>
                        updatePrompt(i, pi, "title", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                    <Textarea
                      placeholder="Prompt 内容"
                      value={prompt.content}
                      onChange={(e) =>
                        updatePrompt(i, pi, "content", e.target.value)
                      }
                      rows={3}
                      className="font-mono text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="使用的模型"
                        value={prompt.model}
                        onChange={(e) =>
                          updatePrompt(i, pi, "model", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                      <Input
                        placeholder="备注/技巧"
                        value={prompt.notes}
                        onChange={(e) =>
                          updatePrompt(i, pi, "notes", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPrompt(i)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> 添加 Prompt
                </Button>
              </div>
            )}

            {section.type === "steps" && (
              <div className="space-y-3">
                {section.steps.map((step, si) => (
                  <div
                    key={si}
                    className="border border-border/40 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        步骤 {step.order}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveStep(i, si, "up")}
                          disabled={si === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveStep(i, si, "down")}
                          disabled={si === section.steps.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeStep(i, si)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      placeholder="步骤标题"
                      value={step.title}
                      onChange={(e) =>
                        updateStep(i, si, "title", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                    <Textarea
                      placeholder="步骤描述"
                      value={step.description}
                      onChange={(e) =>
                        updateStep(i, si, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addStep(i)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> 添加步骤
                </Button>
              </div>
            )}
          </div>
        ))}
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

// Dropdown button for adding a section
function DropdownAddSection({ onAdd }: { onAdd: (type: WorkSection["type"]) => void }) {
  return (
    <div className="flex items-center gap-2">
      {SECTION_TYPES.map((t) => (
        <Button
          key={t.value}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAdd(t.value as WorkSection["type"])}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> {t.label}
        </Button>
      ))}
    </div>
  );
}

// Convert legacy work data to sections format for editing
function legacyToSections(work: Work): WorkSection[] {
  const sections: WorkSection[] = [];
  let order = 0;

  if (work.content) {
    sections.push({
      id: makeSectionId(),
      title: "项目详情",
      type: "markdown",
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
      id: makeSectionId(),
      title: "作品展示",
      type: "images",
      content: "",
      images: work.images,
      prompts: [],
      steps: [],
      order: order++,
      hidden: false,
    });
  }

  if (work.prompts.length > 0) {
    sections.push({
      id: makeSectionId(),
      title: "Prompt 展示",
      type: "prompts",
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
      id: makeSectionId(),
      title: "创作流程",
      type: "steps",
      content: "",
      images: [],
      prompts: [],
      steps: work.workflow,
      order: order++,
      hidden: false,
    });
  }

  if (work.summary) {
    sections.push({
      id: makeSectionId(),
      title: "项目总结",
      type: "markdown",
      content: work.summary,
      images: [],
      prompts: [],
      steps: [],
      order: order++,
      hidden: false,
    });
  }

  return sections;
}
