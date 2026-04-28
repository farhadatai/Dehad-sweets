-- CreateTable
CREATE TABLE "HistoricalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalRevenue" REAL NOT NULL,
    "totalCogs" REAL NOT NULL,
    "totalExpenses" REAL NOT NULL,
    "totalLaborCost" REAL NOT NULL,
    "netProfit" REAL NOT NULL,
    "totalBoxesSold" INTEGER NOT NULL,
    "goal" INTEGER NOT NULL,
    "goalAchieved" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalRecord_month_year_key" ON "HistoricalRecord"("month", "year");
