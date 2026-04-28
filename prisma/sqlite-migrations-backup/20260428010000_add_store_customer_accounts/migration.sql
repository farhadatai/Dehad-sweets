-- Add customer account approval state and store linkage.
ALTER TABLE "User" ADD COLUMN "accountStatus" TEXT NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "User" ADD COLUMN "storeId" TEXT;

CREATE INDEX "User_storeId_idx" ON "User"("storeId");
