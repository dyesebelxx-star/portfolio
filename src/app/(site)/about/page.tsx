import type { Metadata } from "next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解AI内容创作者的背景、技能和创作理念。",
};

const SKILLS = [
  "Midjourney", "Stable Diffusion", "ComfyUI", "DALL·E 3",
  "Runway Gen-2", "Pika Labs", "ElevenLabs", "Suno AI",
  "Prompt Engineering", "视频剪辑", "摄影后期", "创意指导",
];

const EXPERIENCES = [
  {
    year: "2025 — 至今",
    title: "独立 AI 内容创作者",
    description: "专注 AI 视频和图像创作，完成多个 AI 短剧和恋综项目，积累丰富的 Prompt 工程经验。",
  },
  {
    year: "2024 — 2025",
    title: "AI 创意探索期",
    description: "系统学习 AI 图像和视频生成工具，建立了完整的 Prompt 工程方法论，开始创作实验性 AI 作品。",
  },
  {
    year: "2023 — 2024",
    title: "内容创作起步",
    description: "开始接触 AI 工具，探索 AI 在内容创作领域的可能性。",
  },
];

export default function AboutPage() {
  return (
    <div className="container-narrow py-16 sm:py-20">
      {/* Profile */}
      <div className="text-center mb-16">
        <Avatar className="h-24 w-24 mx-auto mb-6">
          <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
            AI
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          关于我
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          AI 内容创作者，专注于探索人工智能在视觉创意领域的无限可能
        </p>
      </div>

      {/* Bio */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4">个人简介</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            我是一名专注于 AI 驱动内容创作的独立创作者。从 2023 年开始，我深度探索了
            Midjourney、Stable Diffusion、Runway、Pika 等前沿 AI 工具，并将它们融入到完整的创意工作流中。
          </p>
          <p>
            我的核心优势在于 <strong className="text-foreground">Prompt 工程</strong>——通过精细化的
            Prompt 设计，我能精确控制 AI 的输出质量、风格和一致性。这使得我能够在人物设计、场景构建和视频生成等领域交付专业级的作品。
          </p>
          <p>
            我特别热衷于 AI 在叙事型内容中的应用，如 AI 短剧和 AI 恋综项目。我相信 AI
            不是要取代创意，而是要放大每个人的创作能力。
          </p>
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Skills */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">技能与工具</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Experience */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-6">创作历程</h2>
        <div className="relative pl-8 border-l-2 border-border/60 space-y-8">
          {EXPERIENCES.map((exp) => (
            <div key={exp.year} className="relative">
              <div className="absolute -left-[29px] h-4 w-4 rounded-full border-2 border-border bg-card" />
              <span className="text-sm text-muted-foreground">{exp.year}</span>
              <h3 className="font-semibold mt-1">{exp.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-16" />

      {/* Philosophy */}
      <section>
        <h2 className="text-xl font-semibold mb-4">创作理念</h2>
        <blockquote className="border-l-2 border-primary pl-5 py-1 text-muted-foreground italic">
          &ldquo;AI 是画笔，Prompt 是颜料，而真正的艺术创作来自人类的想象力和审美判断。
          我致力于在人与 AI 之间找到最佳的协作方式，创造出既高效又有灵魂的作品。&rdquo;
        </blockquote>
      </section>
    </div>
  );
}
