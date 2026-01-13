-- CreateTable
CREATE TABLE "DomesticInvoiceConfiguration" (
    "id" SERIAL NOT NULL,
    "domesticInvoicePrefix" TEXT,
    "domesticInvoiceStartFrom" INTEGER DEFAULT 0,
    "domesticInvoiceSuffix" TEXT,
    "domesticPiPrefix" TEXT,
    "domesticPiStartFrom" INTEGER DEFAULT 0,
    "domesticPiSuffix" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomesticInvoiceConfiguration_pkey" PRIMARY KEY ("id")
);
