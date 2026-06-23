-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "coverImage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '[]',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "prompts" TEXT NOT NULL DEFAULT '[]',
    "workflow" TEXT NOT NULL DEFAULT '[]',
    "summary" TEXT NOT NULL DEFAULT '',
    "sections" TEXT NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Work" ("category", "content", "coverImage", "createdAt", "description", "featured", "id", "images", "prompts", "published", "slug", "summary", "tags", "title", "type", "updatedAt", "videoUrl", "workflow") SELECT "category", "content", "coverImage", "createdAt", "description", "featured", "id", "images", "prompts", "published", "slug", "summary", "tags", "title", "type", "updatedAt", "videoUrl", "workflow" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
CREATE UNIQUE INDEX "Work_slug_key" ON "Work"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
