-- CreateTable
CREATE TABLE "Inventory" (
    "medicineId" TEXT NOT NULL PRIMARY KEY,
    "medicine_name" TEXT NOT NULL,
    "medicine_type" TEXT NOT NULL DEFAULT 'NULL',
    "pack" TEXT NOT NULL,
    "mfgBy" TEXT NOT NULL,
    "hsnCode" INTEGER,
    "mkdBy" TEXT,
    "total_stock" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Batches" (
    "batchId" TEXT NOT NULL PRIMARY KEY,
    "batchNo" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mrp" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "gst" REAL NOT NULL,
    "discount" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "total_amount" REAL NOT NULL,
    "net_pricing" REAL NOT NULL,
    "expiry" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Batches_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Inventory" ("medicineId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice_master" (
    "invoiceMasterId" TEXT NOT NULL PRIMARY KEY,
    "invoice_date" TEXT NOT NULL,
    "invoice_No" TEXT NOT NULL,
    "gross_amount" REAL NOT NULL,
    "total_discount" REAL NOT NULL,
    "total_gst" REAL NOT NULL,
    "grand_total" REAL NOT NULL,
    "added_stock" INTEGER NOT NULL,
    "vendorMasterId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_master_vendorMasterId_fkey" FOREIGN KEY ("vendorMasterId") REFERENCES "Vendor_master" ("vendorMasterId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vendor_master" (
    "vendorMasterId" TEXT NOT NULL PRIMARY KEY,
    "vendor_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_no" INTEGER NOT NULL,
    "email" TEXT,
    "dl_no" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Invoice_prices" (
    "invoicePriceId" TEXT NOT NULL PRIMARY KEY,
    "medicine_name" TEXT NOT NULL,
    "medicine_type" TEXT NOT NULL DEFAULT 'NULL',
    "batchNo" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mrp" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "gst" REAL NOT NULL,
    "discount" REAL NOT NULL,
    "total_med_amount" REAL NOT NULL,
    "expiry" TEXT NOT NULL,
    "invoiceMasterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Invoice_prices_invoiceMasterId_fkey" FOREIGN KEY ("invoiceMasterId") REFERENCES "Invoice_master" ("invoiceMasterId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Memo_master" (
    "memoMasterId" TEXT NOT NULL PRIMARY KEY,
    "memoNo" TEXT NOT NULL,
    "memoDate" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "doctor_name" TEXT NOT NULL,
    "contact" INTEGER NOT NULL,
    "diagnostics" TEXT,
    "address" TEXT,
    "transaction_id" TEXT,
    "gross_amount" REAL NOT NULL,
    "total_discount" REAL NOT NULL,
    "total_gst" REAL NOT NULL,
    "grand_total" REAL NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Memo_prices" (
    "memoPriceId" TEXT NOT NULL PRIMARY KEY,
    "medicine_name" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mrp" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "gst" REAL NOT NULL,
    "discount" REAL NOT NULL,
    "total_price" REAL NOT NULL,
    "expiry" TEXT NOT NULL,
    "pack" TEXT NOT NULL,
    "hsnCode" TEXT,
    "mfgBy" TEXT NOT NULL,
    "memoMasterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Memo_prices_memoMasterId_fkey" FOREIGN KEY ("memoMasterId") REFERENCES "Memo_master" ("memoMasterId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_medicine_name_key" ON "Inventory"("medicine_name");

-- CreateIndex
CREATE UNIQUE INDEX "Batches_batchNo_key" ON "Batches"("batchNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_master_invoice_No_key" ON "Invoice_master"("invoice_No");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_master_vendor_name_key" ON "Vendor_master"("vendor_name");

-- CreateIndex
CREATE UNIQUE INDEX "Memo_master_memoNo_key" ON "Memo_master"("memoNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
