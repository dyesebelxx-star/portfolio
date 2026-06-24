"use server";

import { prisma } from "@/lib/prisma";
import { dbWorkToWork } from "@/lib/db-helpers";
import type { Work } from "@/types";

export async function getFeaturedWorks(): Promise<Work[]> {
  const works = await prisma.work.findMany({
    where: { featured: true, published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return works.map(dbWorkToWork);
}

export async function getWorksByType(type: string): Promise<Work[]> {
  const works = await prisma.work.findMany({
    where: { type, published: true },
    orderBy: { createdAt: "desc" },
  });
  return works.map(dbWorkToWork);
}

export async function getAllWorks(
  filters?: {
    type?: string;
    category?: string;
    search?: string;
  }
): Promise<Work[]> {
  const where: Record<string, unknown> = { published: true };

  if (filters?.type) {
    where.type = filters.type;
  }
  if (filters?.category) {
    where.category = filters.category;
  }
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const works = await prisma.work.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return works.map(dbWorkToWork);
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({
    where: { slug },
  });
  if (!work || !work.published) return null;
  return dbWorkToWork(work);
}

export async function getPromptWorks(): Promise<Work[]> {
  const works = await prisma.work.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      type: true,
      category: true,
      tags: true,
      prompts: true,
      coverImage: true,
      description: true,
    },
  });
  return works.map((w) => ({
    ...dbWorkToWork(w as Parameters<typeof dbWorkToWork>[0]),
  }));
}

// Admin actions
export async function getAdminWorks(): Promise<Work[]> {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
  });
  return works.map(dbWorkToWork);
}

export async function getWorkById(id: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) return null;
  return dbWorkToWork(work);
}

function cleanSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9一-鿿-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createWork(data: Omit<Work, "id" | "createdAt" | "updatedAt">) {
  const slug = cleanSlug(data.slug) || Date.now().toString(36);
  try {
    const work = await prisma.work.create({
      data: {
        slug,
        title: data.title,
        type: data.type,
        category: data.category,
        tags: JSON.stringify(data.tags),
        coverImage: data.coverImage,
        description: data.description,
        content: data.content,
        images: JSON.stringify(data.images),
        videoUrl: data.videoUrl || "",
        prompts: JSON.stringify(data.prompts),
        workflow: JSON.stringify(data.workflow),
        summary: data.summary,
        sections: JSON.stringify(data.sections ?? []),
        featured: data.featured,
        published: data.published,
      },
    });
    return dbWorkToWork(work);
  } catch (error) {
    console.error("createWork Prisma error:", error);
    throw error;
  }
}

export async function updateWork(
  id: string,
  data: Partial<Omit<Work, "id" | "createdAt" | "updatedAt">>
) {
  const updateData: Record<string, unknown> = {};
  if (data.slug !== undefined) updateData.slug = cleanSlug(data.slug);
  if (data.title !== undefined) updateData.title = data.title;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl ?? "";
  if (data.prompts !== undefined) updateData.prompts = JSON.stringify(data.prompts);
  if (data.workflow !== undefined) updateData.workflow = JSON.stringify(data.workflow);
  if (data.summary !== undefined) updateData.summary = data.summary;
  if (data.sections !== undefined) updateData.sections = JSON.stringify(data.sections);
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.published !== undefined) updateData.published = data.published;

  const work = await prisma.work.update({
    where: { id },
    data: updateData,
  });
  return dbWorkToWork(work);
}

export async function deleteWork(id: string) {
  await prisma.work.delete({ where: { id } });
}

export async function getWorkStats() {
  const [total, published, videos, images, featured] = await Promise.all([
    prisma.work.count(),
    prisma.work.count({ where: { published: true } }),
    prisma.work.count({ where: { type: "video" } }),
    prisma.work.count({ where: { type: "image" } }),
    prisma.work.count({ where: { featured: true } }),
  ]);
  return { total, published, videos, images, featured };
}
