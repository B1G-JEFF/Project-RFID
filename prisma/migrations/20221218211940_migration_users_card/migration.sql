/*
  Warnings:

  - You are about to drop the column `user` on the `Cards` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "perm" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cards" ("created_at", "id", "perm", "tag") SELECT "created_at", "id", "perm", "tag" FROM "Cards";
DROP TABLE "Cards";
ALTER TABLE "new_Cards" RENAME TO "Cards";
CREATE UNIQUE INDEX "Cards_tag_key" ON "Cards"("tag");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
