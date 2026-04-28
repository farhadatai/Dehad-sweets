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
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("boxSize", "category", "costPerBox", "createdAt", "id", "isActive", "name", "unitsPerCase", "updatedAt", "wholesalePricePerBox") SELECT "boxSize", "category", "costPerBox", "createdAt", "id", "isActive", "name", "unitsPerCase", "updatedAt", "wholesalePricePerBox" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
