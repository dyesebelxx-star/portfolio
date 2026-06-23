import type { Metadata } from "next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getManySiteConfigs } from "@/actions/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解AI内容创作者的背景、技能和创作理念。",
};

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface AboutSection {
  id: string;
  title: string;
  type: "paragraphs" | "timeline" | "quote";
  items: unknown[];
}

export default async function AboutPage() {
  const configs = await getManySiteConfigs(["about_sections"]);
  const sections: AboutSection[] = JSON.parse(configs.about_sections || "[]");

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

      {/* Dynamic Sections */}
      {sections.map((section, sIdx) => (
        <div key={section.id}>
          {sIdx > 0 && <Separator className="mb-16" />}
          <section className="mb-16">
            {section.title && (
              <h2 className="text-xl font-semibold mb-6">{section.title}</h2>
            )}

            {section.type === "paragraphs" && (
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {(section.items as string[]).map((text, i) => (
                  <p
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: text.replace(
                        /\*\*(.+?)\*\*/g,
                        "<strong class='text-foreground font-semibold'>$1</strong>"
                      ),
                    }}
                  />
                ))}
              </div>
            )}

            {section.type === "timeline" && (
              <div className="relative pl-8 border-l-2 border-border/60 space-y-8">
                {(section.items as TimelineItem[]).map((item) => (
                  <div key={item.year + item.title} className="relative">
                    <div className="absolute -left-[29px] h-4 w-4 rounded-full border-2 border-border bg-card" />
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                    <h3 className="font-semibold mt-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === "quote" && (
              <blockquote className="border-l-2 border-primary pl-5 py-1 text-muted-foreground italic">
                &ldquo;{(section.items as string[])[0] || ""}&rdquo;
              </blockquote>
            )}
          </section>
        </div>
      ))}

      {sections.length === 0 && (
        <p className="text-center text-muted-foreground py-12">暂无内容</p>
      )}
    </div>
  );
}
