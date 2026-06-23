import Link from "next/link";
import Image from "next/image";
import { Play, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Work } from "@/types";

interface WorkCardProps {
  work: Pick<Work, "slug" | "title" | "type" | "category" | "coverImage" | "description" | "tags">;
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <Link href={`/works/${work.slug}`} className="group">
      <Card className="overflow-hidden border border-border/60 bg-card hover:border-border hover:shadow-sm transition-all duration-300 h-full">
        {/* Cover Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {work.coverImage ? (
            <Image
              src={work.coverImage}
              alt={work.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {work.type === "video" ? (
                <Play className="h-10 w-10 text-muted-foreground/40" />
              ) : (
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              )}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm text-xs font-normal"
            >
              {work.type === "video" ? "视频" : "图片"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-normal">
              {work.category}
            </Badge>
          </div>
          <h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
            {work.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {work.description}
          </p>
          {work.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {work.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground/70 bg-muted px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
