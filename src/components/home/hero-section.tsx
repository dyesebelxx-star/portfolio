import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getManySiteConfigs } from "@/actions/site-config";

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

export async function HeroSection() {
  const configs = await getManySiteConfigs(["about_sections"]);
  const sections: AboutSection[] = JSON.parse(configs.about_sections || "[]");

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Subtle gradient decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Hero */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Open to opportunities
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              罗欣欣的作品集
            </h1>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
              <Link
                href="/works"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
              >
                查看作品 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/admin/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8")}
              >
                管理
              </Link>
            </div>
          </div>

          {/* Right: About */}
          <div className="lg:pl-4 lg:border-l lg:border-border/40">
            {sections.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">暂无内容</p>
            ) : (
              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.id}>
                    {section.title && (
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                    )}

                    {section.type === "paragraphs" && (
                      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
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
                      <div className="space-y-3">
                        {(section.items as TimelineItem[]).map((item) => (
                          <div key={item.year + item.title} className="flex gap-3">
                            <span className="text-xs text-muted-foreground shrink-0 w-20 pt-0.5">
                              {item.year}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === "quote" && (
                      <blockquote className="border-l-2 border-primary/30 pl-4 text-sm text-muted-foreground italic">
                        &ldquo;{(section.items as string[])[0] || ""}&rdquo;
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
