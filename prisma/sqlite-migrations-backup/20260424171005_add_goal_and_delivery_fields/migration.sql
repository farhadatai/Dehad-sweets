-- AlterTable
ALTER TABLE "Expense" ADD COLUMN "receipt" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveredBy" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveryInvoice" TEXT;
ALTER TABLE "Order" ADD COLUMN "receiverName" TEXT;

-- CreateTable
CREATE TABLE "ProductionGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "goal" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionGoal_month_year_key" ON "ProductionGoal"("month", "year");
