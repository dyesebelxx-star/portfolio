import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

function uploadBaseDir(): string {
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  return join(process.cwd(), "public", "uploads");
}

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = join(uploadBaseDir(), ...path);

  try {
    const buffer = await readFile(filePath);
    const ext = "." + (filePath.split(".").pop() || "jpg");
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
