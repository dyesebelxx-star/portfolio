import type { Work, WorkFormData, ImageItem } from "@/types";
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
    images: parseImageArray(db.images),
    prompts: parseJsonArray(db.prompts),
    workflow: parseJsonArray(db.workflow),
    sections: parseSections(db.sections),
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

/** Parse images array — handle old string[] → ImageItem[] */
function parseImageArray(value: string): ImageItem[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: unknown): ImageItem => {
      if (typeof item === "string") {
        return { url: item, prompt: "" };
      }
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        return {
          url: typeof obj.url === "string" ? obj.url : "",
          prompt: typeof obj.prompt === "string" ? obj.prompt : "",
        };
      }
      return { url: "", prompt: "" };
    }).filter((img) => img.url);
  } catch {
    return [];
  }
}

/** Parse sections — handle legacy image arrays inside sections */
function parseSections(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((section: Record<string, unknown> & { images?: unknown }) => ({
      ...section,
      images: Array.isArray(section.images)
        ? section.images.map((item: unknown) => {
            if (typeof item === "string") return { url: item, prompt: "" };
            if (typeof item === "object" && item !== null) {
              const obj = item as Record<string, unknown>;
              return {
                url: typeof obj.url === "string" ? obj.url : "",
                prompt: typeof obj.prompt === "string" ? obj.prompt : "",
              };
            }
            return { url: "", prompt: "" };
          }).filter((img: ImageItem) => img.url)
        : [],
    }));
  } catch {
    return [];
  }
}
