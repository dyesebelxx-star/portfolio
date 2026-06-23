import { WorkForm } from "@/components/admin/work-form";

export default function NewWorkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">新增作品</h1>
        <p className="text-muted-foreground text-sm">
          填写作品信息并发布，系统将自动生成作品详情页
        </p>
      </div>
      <WorkForm />
    </div>
  );
}
