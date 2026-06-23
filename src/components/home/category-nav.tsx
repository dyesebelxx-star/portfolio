import Link from "next/link";
import { Video, Image, Terminal } from "lucide-react";

const CATEGORIES = [
  {
    href: "/works/videos",
    icon: Video,
    title: "AI 短视频",
    description: "AI短剧 · 恋综 · 创意视频",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    href: "/works/images",
    icon: Image,
    title: "AI 图片",
    description: "人物设计 · 场景设计 · 时装系列",
    color: "text-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    href: "/prompts",
    icon: Terminal,
    title: "Prompt 库",
    description: "精选Prompt · 工程实践 · 技巧分享",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

export function CategoryNav() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            探索我的作品
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            按类别浏览不同类型的 AI 内容创作作品
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative rounded-2xl border border-border/60 bg-card p-8 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${cat.bgColor} mb-5`}
              >
                <cat.icon className={`h-6 w-6 ${cat.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
