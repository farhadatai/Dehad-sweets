/*
  Warnings:

  - Made the column `email` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hourlyRate` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "pin" TEXT,
    "hourlyRate" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("createdAt", "email", "hourlyRate", "id", "name", "password", "pin", "role", "updatedAt") SELECT "createdAt", "email", "hourlyRate", "id", "name", "password", "pin", "role", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
