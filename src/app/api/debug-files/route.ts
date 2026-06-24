import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const cwd = process.cwd();
  const dirs = ["public/uploads/images", "public/uploads/covers", "public/uploads/videos"];
  const result: Record<string, unknown> = { cwd };

  for (const d of dirs) {
    const full = join(cwd, d);
    try {
      const files = await readdir(full);
      const details = await Promise.all(
        files.map(async (f) => {
          const s = await stat(join(full, f));
          return { name: f, size: s.size, created: s.birthtime };
        })
      );
      result[d] = { exists: true, files: details };
    } catch {
      result[d] = { exists: false };
    }
  }

  return NextResponse.json(result);
}
