"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileVideo, Plus, Settings, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/works", label: "作品管理", icon: FileVideo },
  { href: "/admin/works/new", label: "新增作品", icon: Plus },
  { href: "/admin/settings", label: "网站设置", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border/40 bg-card hidden lg:flex flex-col shrink-0">
      <div className="p-4 border-b border-border/40">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            A
          </span>
          管理后台
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border/40 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Home className="h-4 w-4" />
          返回网站
        </Link>
        <form action={logout}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </form>
      </div>
    </aside>
  );
}
