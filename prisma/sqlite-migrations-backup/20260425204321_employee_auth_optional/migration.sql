/*
  Warnings:

  - You are about to drop the column `payRate` on the `Employee` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "pin" TEXT,
    "hourlyRate" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("createdAt", "id", "name", "pin", "role", "updatedAt") SELECT "createdAt", "id", "name", "pin", "role", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
