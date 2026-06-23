import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactCTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-narrow text-center">
        <div className="rounded-2xl border border-border/60 bg-card p-10 sm:p-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            开始合作
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            如果您对我的 AI 内容创作能力感兴趣，欢迎随时联系我，一起探索 AI 创意的无限可能。
          </p>
          <Link
            href="/contact"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
          >
            联系我 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
