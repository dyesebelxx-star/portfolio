import type { Work, WorkFormData } from "@/types";
import type { Work as PrismaWork } from "@prisma/client";

/**
 * Convert a Prisma Work DB object to the app Work type by parsing JSON fields.
 */
export function dbWorkToWork(db: PrismaWork): Work {
  return {
    ...db,
    type: db.type as Work["type"],
    category: db.category as Work["category"],
    tags: parseJsonArray(db.tags),
    images: parseJsonArray(db.images),
    prompts: parseJsonArray(db.prompts),
    workflow: parseJsonArray(db.workflow),
    sections: parseJsonArray(db.sections),
    videoUrl: db.videoUrl || null,
  };
}

/**
 * Prepare work data for database insertion.
 * Stringifies all JSON array fields.
 */
export function workToDb(data: WorkFormData) {
  return {
    ...data,
    tags: JSON.stringify(data.tags),
    images: JSON.stringify(data.images),
    prompts: JSON.stringify(data.prompts),
    workflow: JSON.stringify(data.workflow),
    sections: JSON.stringify(data.sections ?? []),
    videoUrl: data.videoUrl || "",
  };
}

function parseJsonArray<T = unknown>(value: string): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
