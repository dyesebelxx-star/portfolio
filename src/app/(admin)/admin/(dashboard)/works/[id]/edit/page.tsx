import { notFound } from "next/navigation";
import { getWorkById } from "@/actions/work";
import { WorkForm } from "@/components/admin/work-form";

interface EditWorkPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const { id } = await params;
  const work = await getWorkById(id);

  if (!work) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">编辑作品</h1>
        <p className="text-muted-foreground text-sm">
          编辑「{work.title}」
        </p>
      </div>
      <WorkForm work={work} />
    </div>
  );
}
