import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatsCards } from "@/components/admin/stats-cards";
import { getWorkStats, getAdminWorks } from "@/actions/work";

export default async function AdminDashboard() {
  const stats = await getWorkStats();
  const recentWorks = await getAdminWorks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">仪表盘</h1>
        <p className="text-muted-foreground text-sm">欢迎回来，管理你的AI作品集</p>
      </div>

      <StatsCards stats={stats} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">作品列表</h2>
          <Link
            href="/admin/works/new"
            className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
          >
            <Plus className="h-4 w-4 mr-1" /> 新增作品
          </Link>
        </div>

        <div className="border border-border/60 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">标题</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">类型</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">分类</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">状态</th>
                <th className="text-right p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentWorks.slice(0, 10).map((work) => (
                <tr key={work.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium">{work.title}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">
                    {work.type === "video" ? "视频" : "图片"}
                  </td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{work.category}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        work.published
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {work.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/works/${work.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      编辑 <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentWorks.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              暂无作品，点击上方按钮开始创建
            </div>
          )}
        </div>

        {recentWorks.length > 10 && (
          <div className="text-center mt-4">
            <Link
              href="/admin/works"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              查看全部作品
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
