-- CreateTable
CREATE TABLE "ProformaInvoice" (
    "id" SERIAL NOT NULL,
    "quotationId" INTEGER,
    "piNo" TEXT NOT NULL,
    "date" TIMESTAMP(3),
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

    CONSTRAINT "ProformaInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaInvoiceProduct" (
    "id" SERIAL NOT NULL,
    "proformaInvoiceId" INTEGER NOT NULL,
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

    CONSTRAINT "ProformaInvoiceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaInvoiceContainer" (
    "id" SERIAL NOT NULL,
    "proformaInvoiceId" INTEGER NOT NULL,
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

    CONSTRAINT "ProformaInvoiceContainer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProformaInvoice_piNo_key" ON "ProformaInvoice"("piNo");

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceProduct" ADD CONSTRAINT "ProformaInvoiceProduct_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceProduct" ADD CONSTRAINT "ProformaInvoiceProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceProduct" ADD CONSTRAINT "ProformaInvoiceProduct_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceProduct" ADD CONSTRAINT "ProformaInvoiceProduct_packageTypeId_fkey" FOREIGN KEY ("packageTypeId") REFERENCES "PackageType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceProduct" ADD CONSTRAINT "ProformaInvoiceProduct_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceContainer" ADD CONSTRAINT "ProformaInvoiceContainer_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
