import type { Metadata } from "next";
import { Mail, MapPin, Globe, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getManySiteConfigs } from "@/actions/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "联系方式",
  description: "联系AI内容创作者，探讨合作机会或交流AI创作经验。",
};

export default async function ContactPage() {
  const configs = await getManySiteConfigs([
    "contact_email",
    "contact_location",
    "contact_github",
    "contact_twitter",
  ]);

  const email = configs.contact_email || "hello@example.com";
  const location = configs.contact_location || "中国 · 北京";
  const github = configs.contact_github || "https://github.com";
  const twitter = configs.contact_twitter || "https://twitter.com";

  return (
    <div className="container-narrow py-16 sm:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          联系我
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          如果您对我的作品感兴趣，或想探讨合作机会，欢迎随时联系
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <span>{email}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{location}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3">社交媒体</h3>
            <div className="flex gap-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <AtSign className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          <form className="space-y-5 bg-card border border-border/60 rounded-2xl p-6 sm:p-8">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" placeholder="您的姓名" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">主题</Label>
              <Input id="subject" placeholder="合作咨询 / 项目讨论 / 其他" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">信息</Label>
              <Textarea
                id="message"
                placeholder="请描述您的需求或想法..."
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-full">
              发送信息
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
