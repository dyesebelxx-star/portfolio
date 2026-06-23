import { FileVideo, Image, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    published: number;
    videos: number;
    images: number;
    featured: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    { label: "作品总数", value: stats.total, icon: FileVideo, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "已发布", value: stats.published, icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "视频作品", value: stats.videos, icon: FileVideo, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "图片作品", value: stats.images, icon: Image, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
