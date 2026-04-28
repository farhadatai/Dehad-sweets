-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pricePerBox" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "orderDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" DATETIME NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "orderStatus" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "deliveryDate", "id", "notes", "orderDate", "orderStatus", "paymentStatus", "pricePerBox", "productId", "quantity", "storeId", "totalPrice", "updatedAt") SELECT "createdAt", "deliveryDate", "id", "notes", "orderDate", "orderStatus", "paymentStatus", "pricePerBox", "productId", "quantity", "storeId", "totalPrice", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Payroll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "payPeriodStart" DATETIME NOT NULL,
    "payPeriodEnd" DATETIME NOT NULL,
    "totalHours" REAL NOT NULL,
    "totalPay" REAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Payroll" ("createdAt", "employeeId", "id", "isPaid", "payPeriodEnd", "payPeriodStart", "totalHours", "totalPay", "updatedAt") SELECT "createdAt", "employeeId", "id", "isPaid", "payPeriodEnd", "payPeriodStart", "totalHours", "totalPay", "updatedAt" FROM "Payroll";
DROP TABLE "Payroll";
ALTER TABLE "new_Payroll" RENAME TO "Payroll";
CREATE TABLE "new_TimeLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "clockIn" DATETIME NOT NULL,
    "clockOut" DATETIME,
    "totalHours" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TimeLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TimeLog" ("clockIn", "clockOut", "createdAt", "employeeId", "id", "totalHours", "updatedAt") SELECT "clockIn", "clockOut", "createdAt", "employeeId", "id", "totalHours", "updatedAt" FROM "TimeLog";
DROP TABLE "TimeLog";
ALTER TABLE "new_TimeLog" RENAME TO "TimeLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
