/*
  Warnings:

  - You are about to drop the column `piecesPerBox` on the `Product` table. All the data in the column will be lost.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitsPerCase` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "boxSize" TEXT NOT NULL,
    "unitsPerCase" INTEGER NOT NULL,
    "costPerBox" REAL NOT NULL,
    "wholesalePricePerBox" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("boxSize", "costPerBox", "createdAt", "id", "isActive", "name", "updatedAt", "wholesalePricePerBox") SELECT "boxSize", "costPerBox", "createdAt", "id", "isActive", "name", "updatedAt", "wholesalePricePerBox" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
