"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setManySiteConfigs } from "@/actions/site-config";
import { toast } from "sonner";

// Types
type SectionType = "paragraphs" | "timeline" | "quote";

interface AboutSection {
  id: string;
  title: string;
  type: SectionType;
  items: unknown[];
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

let sectionIdCounter = Date.now();

function newSection(type: SectionType = "paragraphs"): AboutSection {
  return {
    id: String(++sectionIdCounter),
    title: "",
    type,
    items: type === "timeline" ? [] : [],
  };
}

export function SettingsForm({ configs }: { configs: Record<string, string> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // About — dynamic sections
  const [sections, setSections] = useState<AboutSection[]>(
    JSON.parse(configs.about_sections || "[]")
  );

  // Contact
  const [contactEmail, setContactEmail] = useState(configs.contact_email || "");
  const [contactLocation, setContactLocation] = useState(configs.contact_location || "");
  const [contactGithub, setContactGithub] = useState(configs.contact_github || "");
  const [contactTwitter, setContactTwitter] = useState(configs.contact_twitter || "");

  // Skills
  const [skills, setSkills] = useState<string[]>(
    JSON.parse(configs.skills || "[]")
  );

  // --- Section CRUD ---
  function addSection(type: SectionType) {
    setSections([...sections, newSection(type)]);
  }

  function updateSection(id: string, field: "title" | "type", value: string | null) {
    if (value === null) return;
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function removeSection(id: string) {
    setSections(sections.filter((s) => s.id !== id));
  }

  function moveSection(id: string, direction: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setSections(updated);
  }

  // --- Paragraph items ---
  function addParagraph(sectionId: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, ""] } : s
      )
    );
  }

  function updateParagraph(sectionId: string, index: number, value: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((item, i) => (i === index ? value : item)) }
          : s
      )
    );
  }

  function removeParagraph(sectionId: string, index: number) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((_, i) => i !== index) }
          : s
      )
    );
  }

  // --- Timeline items ---
  function addTimelineItem(sectionId: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: [...s.items, { year: "", title: "", description: "" }] }
          : s
      )
    );
  }

  function updateTimelineItem(
    sectionId: string,
    index: number,
    field: keyof TimelineItem,
    value: string
  ) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: (s.items as TimelineItem[]).map((item, i) =>
                i === index ? { ...item, [field]: value } : item
              ),
            }
          : s
      )
    );
  }

  function removeTimelineItem(sectionId: string, index: number) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: (s.items as TimelineItem[]).filter((_, i) => i !== index) }
          : s
      )
    );
  }

  // --- Quote items ---
  function updateQuote(sectionId: string, value: string) {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, items: [value] } : s
      )
    );
  }

  // --- Skills ---
  function addSkill() {
    setSkills([...skills, ""]);
  }

  function updateSkill(index: number, value: string) {
    setSkills(skills.map((s, i) => (i === index ? value : s)));
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  // --- Save ---
  async function handleSave() {
    setSaving(true);
    try {
      await setManySiteConfigs({
        about_sections: JSON.stringify(sections),
        contact_email: contactEmail,
        contact_location: contactLocation,
        contact_github: contactGithub,
        contact_twitter: contactTwitter,
        skills: JSON.stringify(skills.filter(Boolean)),
      });
      toast.success("设置已保存");
      router.refresh();
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">关于我</TabsTrigger>
          <TabsTrigger value="contact">联系方式</TabsTrigger>
          <TabsTrigger value="skills">技能工具</TabsTrigger>
        </TabsList>

        {/* ========== ABOUT TAB ========== */}
        <TabsContent value="about" className="space-y-6 mt-6">
          {/* Add section buttons */}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => addSection("paragraphs")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> 添加文本区块
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection("timeline")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> 添加时间线区块
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addSection("quote")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> 添加引用区块
            </Button>
          </div>

          {sections.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              暂无区块，点击上方按钮添加
            </p>
          )}

          <div className="space-y-6">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="border border-border/60 rounded-xl p-5 space-y-4"
              >
                {/* Section header */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveSection(section.id, "up")}
                      disabled={sIdx === 0}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveSection(section.id, "down")}
                      disabled={sIdx === sections.length - 1}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      placeholder="区块标题"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, "title", e.target.value)}
                      className="sm:col-span-2"
                    />
                    <Select
                      value={section.type}
                      onValueChange={(v) => updateSection(section.id, "type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraphs">文本</SelectItem>
                        <SelectItem value="timeline">时间线</SelectItem>
                        <SelectItem value="quote">引用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                {/* Section content by type */}
                {section.type === "paragraphs" && (
                  <div className="space-y-3">
                    {(section.items as string[]).map((text, i) => (
                      <div key={i} className="flex gap-2">
                        <Textarea
                          value={text}
                          onChange={(e) => updateParagraph(section.id, i, e.target.value)}
                          placeholder={`段落 ${i + 1}...`}
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeParagraph(section.id, i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addParagraph(section.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> 添加段落
                    </Button>
                  </div>
                )}

                {section.type === "timeline" && (
                  <div className="space-y-3">
                    {(section.items as TimelineItem[]).map((item, i) => (
                      <div key={i} className="border border-border/40 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">#{i + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeTimelineItem(section.id, i)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="年份"
                            value={item.year}
                            onChange={(e) => updateTimelineItem(section.id, i, "year", e.target.value)}
                          />
                          <Input
                            placeholder="标题"
                            value={item.title}
                            onChange={(e) => updateTimelineItem(section.id, i, "title", e.target.value)}
                          />
                        </div>
                        <Textarea
                          placeholder="描述"
                          value={item.description}
                          onChange={(e) => updateTimelineItem(section.id, i, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addTimelineItem(section.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> 添加时间节点
                    </Button>
                  </div>
                )}

                {section.type === "quote" && (
                  <div>
                    <Textarea
                      value={(section.items as string[])[0] || ""}
                      onChange={(e) => updateQuote(section.id, e.target.value)}
                      placeholder="引用文本..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ========== CONTACT TAB ========== */}
        <TabsContent value="contact" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>邮箱</Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hello@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>所在地</Label>
              <Input
                value={contactLocation}
                onChange={(e) => setContactLocation(e.target.value)}
                placeholder="中国 · 北京"
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub 链接</Label>
              <Input
                value={contactGithub}
                onChange={(e) => setContactGithub(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter 链接</Label>
              <Input
                value={contactTwitter}
                onChange={(e) => setContactTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </TabsContent>

        {/* ========== SKILLS TAB ========== */}
        <TabsContent value="skills" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">技能与工具</Label>
            <Button type="button" variant="outline" size="sm" onClick={addSkill}>
              <Plus className="h-3.5 w-3.5 mr-1" /> 添加技能
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((skill, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => updateSkill(i, e.target.value)}
                  placeholder="技能名称"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeSkill(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <Button onClick={handleSave} disabled={saving} className="rounded-full px-8">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        保存设置
      </Button>
    </div>
  );
}
