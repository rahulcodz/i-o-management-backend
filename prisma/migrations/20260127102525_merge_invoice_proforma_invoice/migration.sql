/*
  Warnings:

  - You are about to drop the `ProformaInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProformaInvoiceContainer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProformaInvoiceProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProformaInvoice" DROP CONSTRAINT "ProformaInvoice_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoiceContainer" DROP CONSTRAINT "ProformaInvoiceContainer_proformaInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoiceProduct" DROP CONSTRAINT "ProformaInvoiceProduct_materialId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoiceProduct" DROP CONSTRAINT "ProformaInvoiceProduct_packageTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoiceProduct" DROP CONSTRAINT "ProformaInvoiceProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoiceProduct" DROP CONSTRAINT "ProformaInvoiceProduct_proformaInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoiceProduct" DROP CONSTRAINT "ProformaInvoiceProduct_unitId_fkey";

-- DropTable
DROP TABLE "ProformaInvoice";

-- DropTable
DROP TABLE "ProformaInvoiceContainer";

-- DropTable
DROP TABLE "ProformaInvoiceProduct";

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "quotationId" INTEGER,
    "piNo" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "isProformaInvoice" BOOLEAN NOT NULL DEFAULT false,
    "consigneeDetails" JSONB,
    "shipmentDetails" JSONB,
    "shipmentModel" JSONB,
    "remarks" TEXT,
    "internalNote" TEXT,
    "productionDate" TIMESTAMP(3),
    "productionExpiryDate" TIMESTAMP(3),
    "placeOfReceiptByPreCarrier" TEXT,
    "vesselFlightNo" TEXT,
    "salesBroker" BOOLEAN NOT NULL DEFAULT false,
    "palletised" BOOLEAN NOT NULL DEFAULT false,
    "brokerage" DOUBLE PRECISION,
    "brokeragePercentage" DOUBLE PRECISION,
    "soldBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceProduct" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productId" INTEGER,
    "unitId" INTEGER,
    "quantity" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "package" TEXT,
    "productDescription" TEXT,
    "netWeight" DOUBLE PRECISION,
    "grossWeight" DOUBLE PRECISION,
    "totalPackages" DOUBLE PRECISION,
    "packageTypeId" INTEGER,
    "qualitySpec" TEXT,
    "materialId" INTEGER,
    "marking" TEXT,
    "markingFile" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceContainer" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "containerNo" TEXT,
    "lineSealNo" TEXT,
    "rfidSealNo" TEXT,
    "sizeType" TEXT,
    "boxes" INTEGER,
    "lotNo" TEXT,
    "netWeight" DOUBLE PRECISION,
    "grossWeight" DOUBLE PRECISION,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceContainer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_piNo_key" ON "Invoice"("piNo");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_packageTypeId_fkey" FOREIGN KEY ("packageTypeId") REFERENCES "PackageType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceContainer" ADD CONSTRAINT "InvoiceContainer_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
