"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { setManySiteConfigs } from "@/actions/site-config";
import { toast } from "sonner";

interface Experience {
  year: string;
  title: string;
  description: string;
}

export function SettingsForm({ configs }: { configs: Record<string, string> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // About
  const [bio, setBio] = useState(JSON.parse(configs.about_bio || "[]") as string[]);
  const [experiences, setExperiences] = useState<Experience[]>(
    JSON.parse(configs.about_experiences || "[]")
  );
  const [philosophy, setPhilosophy] = useState(configs.about_philosophy || "");

  // Contact
  const [contactEmail, setContactEmail] = useState(configs.contact_email || "");
  const [contactLocation, setContactLocation] = useState(configs.contact_location || "");
  const [contactGithub, setContactGithub] = useState(configs.contact_github || "");
  const [contactTwitter, setContactTwitter] = useState(configs.contact_twitter || "");

  // Skills
  const [skills, setSkills] = useState<string[]>(
    JSON.parse(configs.skills || "[]")
  );

  function addBioParagraph() {
    setBio([...bio, ""]);
  }

  function updateBio(index: number, value: string) {
    const updated = [...bio];
    updated[index] = value;
    setBio(updated);
  }

  function removeBio(index: number) {
    setBio(bio.filter((_, i) => i !== index));
  }

  function addExperience() {
    setExperiences([...experiences, { year: "", title: "", description: "" }]);
  }

  function updateExperience(index: number, field: keyof Experience, value: string) {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  }

  function removeExperience(index: number) {
    setExperiences(experiences.filter((_, i) => i !== index));
  }

  function addSkill() {
    setSkills([...skills, ""]);
  }

  function updateSkill(index: number, value: string) {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setManySiteConfigs({
        about_bio: JSON.stringify(bio.filter(Boolean)),
        about_experiences: JSON.stringify(experiences.filter((e) => e.year && e.title)),
        about_philosophy: philosophy,
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

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">个人简介</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBioParagraph}>
                <Plus className="h-3.5 w-3.5 mr-1" /> 添加段落
              </Button>
            </div>
            {bio.map((text, i) => (
              <div key={i} className="flex gap-2">
                <Textarea
                  value={text}
                  onChange={(e) => updateBio(i, e.target.value)}
                  placeholder={`段落 ${i + 1}...`}
                  rows={3}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeBio(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">创作历程</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-3.5 w-3.5 mr-1" /> 添加经历
              </Button>
            </div>
            {experiences.map((exp, i) => (
              <div key={i} className="border border-border/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">经历 #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeExperience(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="年份 (如: 2025 — 至今)"
                    value={exp.year}
                    onChange={(e) => updateExperience(i, "year", e.target.value)}
                  />
                  <Input
                    placeholder="标题"
                    value={exp.title}
                    onChange={(e) => updateExperience(i, "title", e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="描述"
                  value={exp.description}
                  onChange={(e) => updateExperience(i, "description", e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-base font-semibold">创作理念</Label>
            <Textarea
              value={philosophy}
              onChange={(e) => setPhilosophy(e.target.value)}
              placeholder="你的创作理念..."
              rows={3}
            />
          </div>
        </TabsContent>

        {/* Contact Tab */}
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

        {/* Skills Tab */}
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
