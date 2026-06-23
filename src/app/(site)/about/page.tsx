import type { Metadata } from "next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getManySiteConfigs } from "@/actions/site-config";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解AI内容创作者的背景、技能和创作理念。",
};

interface Experience {
  year: string;
  title: string;
  description: string;
}

export default async function AboutPage() {
  const configs = await getManySiteConfigs([
    "about_bio",
    "about_experiences",
    "about_philosophy",
    "skills",
  ]);

  const bio: string[] = JSON.parse(configs.about_bio || "[]");
  const experiences: Experience[] = JSON.parse(configs.about_experiences || "[]");
  const philosophy: string = configs.about_philosophy || "";
  const skills: string[] = JSON.parse(configs.skills || "[]");

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
      {bio.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4">个人简介</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {bio.map((paragraph, i) => (
              <p
                key={i}
                dangerouslySetInnerHTML={{
                  __html: paragraph.replace(
                    /\*\*(.+?)\*\*/g,
                    "<strong class='text-foreground font-semibold'>$1</strong>"
                  ),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {bio.length > 0 && <Separator className="mb-16" />}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">技能与工具</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && <Separator className="mb-16" />}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">创作历程</h2>
          <div className="relative pl-8 border-l-2 border-border/60 space-y-8">
            {experiences.map((exp) => (
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
      )}

      {experiences.length > 0 && <Separator className="mb-16" />}

      {/* Philosophy */}
      {philosophy && (
        <section>
          <h2 className="text-xl font-semibold mb-4">创作理念</h2>
          <blockquote className="border-l-2 border-primary pl-5 py-1 text-muted-foreground italic">
            &ldquo;{philosophy}&rdquo;
          </blockquote>
        </section>
      )}
    </div>
  );
}
