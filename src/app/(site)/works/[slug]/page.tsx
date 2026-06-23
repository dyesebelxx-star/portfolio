import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWorkBySlug, getAllWorks } from "@/actions/work";
import { WorkDetailContent } from "@/components/works/work-detail-content";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const works = await getAllWorks();
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "作品未找到" };

  return {
    title: work.title,
    description: work.description,
    openGraph: {
      title: work.title,
      description: work.description,
      type: "article",
      images: work.coverImage ? [work.coverImage] : [],
    },
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) notFound();

  return <WorkDetailContent work={work} />;
}
