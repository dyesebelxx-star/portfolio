import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Subtle gradient decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow text-center">
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

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          业余ai内容创作者
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
    </section>
  );
}
