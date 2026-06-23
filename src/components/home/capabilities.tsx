import { Wand2, Users, Building2, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getManySiteConfigs } from "@/actions/site-config";

const CAPABILITIES = [
  {
    icon: Wand2,
    title: "Prompt 工程",
    description:
      "精通 Midjourney、Stable Diffusion、DALL·E 等多个 AI 平台的 Prompt 编写，能够精准控制生成结果的质量和风格。",
  },
  {
    icon: Users,
    title: "人物设计",
    description:
      "擅长使用 AI 工具进行角色设计，通过精细的 Prompt 控制实现人物一致性和多样化的角色形象塑造。",
  },
  {
    icon: Building2,
    title: "场景设计",
    description:
      "从科幻都市到古风庭院，能够通过 AI 构建丰富的视觉场景，为作品提供沉浸式的视觉体验。",
  },
  {
    icon: GitBranch,
    title: "完整制作流程",
    description:
      "覆盖从创意构思、Prompt 设计、AI 生成、后期处理到成品输出的全流程，具备端到端的项目交付能力。",
  },
];

export async function Capabilities() {
  const configs = await getManySiteConfigs(["skills"]);
  const skills: string[] = JSON.parse(configs.skills || "[]");

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            核心能力
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            专注于 AI 内容创作的关键技能领域
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="group relative rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/20 transition-all duration-300"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 mb-4">
                <cap.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{cap.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        {skills.length > 0 && (
          <div className="text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              常用工具与技术
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
