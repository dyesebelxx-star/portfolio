import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminWorks } from "@/actions/work";
import { DeleteWorkButton } from "./delete-button";

export default async function AdminWorksPage() {
  const works = await getAdminWorks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">作品管理</h1>
          <p className="text-muted-foreground text-sm">
            共 {works.length} 个作品
          </p>
        </div>
        <Link
          href="/admin/works/new"
          className={cn(buttonVariants(), "rounded-full")}
        >
          <Plus className="h-4 w-4 mr-1" /> 新增作品
        </Link>
      </div>

      <div className="border border-border/60 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground">标题</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Slug</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">类型</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">分类</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">精选</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">状态</th>
              <th className="text-right p-3 font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr
                key={work.id}
                className="border-b border-border/20 hover:bg-muted/20 transition-colors"
              >
                <td className="p-3">
                  <span className="font-medium line-clamp-1">{work.title}</span>
                </td>
                <td className="p-3 text-muted-foreground font-mono text-xs hidden md:table-cell">
                  {work.slug}
                </td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">
                  {work.type === "video" ? "视频" : "图片"}
                </td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">
                  {work.category}
                </td>
                <td className="p-3 hidden lg:table-cell">
                  {work.featured ? "⭐" : "-"}
                </td>
                <td className="p-3 hidden lg:table-cell">
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
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/works/${work.slug}`}
                      target="_blank"
                      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/admin/works/${work.id}/edit`}
                      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteWorkButton id={work.id} title={work.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {works.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-3">暂无作品</p>
            <Link
              href="/admin/works/new"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              创建第一个作品
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
