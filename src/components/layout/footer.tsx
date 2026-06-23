import Link from "next/link";
import { Globe, AtSign, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                AI
              </span>
              Portfolio
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI内容创作者 · 探索人工智能的创意边界
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">快速导航</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                作品展示
              </Link>
              <Link href="/prompts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Prompt Library
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                关于我
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">社交媒体</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                aria-label="GitHub"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                aria-label="Twitter"
              >
                <AtSign className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@example.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Portfolio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js · Designed with care
          </p>
        </div>
      </div>
    </footer>
  );
}
