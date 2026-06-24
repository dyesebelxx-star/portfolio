"use server";

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getSession } from "@/lib/auth";

// Simple UUID generation (avoid extra dependency)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function uploadBaseDir(): string {
  // UPLOAD_DIR env var for production (e.g. /data/uploads), fallback to public/uploads for local dev
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  return join(process.cwd(), "public", "uploads");
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "未授权" };

  const file = formData.get("file") as File;
  if (!file) return { error: "未选择文件" };

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "不支持的图片格式" };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { error: "图片大小不能超过 10MB" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${generateId()}.${ext}`;
  const dir = join(uploadBaseDir(), "images");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  return { url: `/uploads/images/${filename}` };
}

export async function uploadVideo(formData: FormData): Promise<{ url: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "未授权" };

  const file = formData.get("file") as File;
  if (!file) return { error: "未选择文件" };

  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { error: "不支持的视频格式" };
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return { error: "视频大小不能超过 200MB" };
  }

  const ext = file.name.split(".").pop() || "mp4";
  const filename = `${generateId()}.${ext}`;
  const dir = join(uploadBaseDir(), "videos");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  return { url: `/uploads/videos/${filename}` };
}

export async function uploadCover(formData: FormData): Promise<{ url: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "未授权" };

  const file = formData.get("file") as File;
  if (!file) return { error: "未选择文件" };

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "不支持的图片格式" };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { error: "图片大小不能超过 10MB" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${generateId()}.${ext}`;
  const dir = join(uploadBaseDir(), "covers");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, filename), buffer);

  return { url: `/uploads/covers/${filename}` };
}
