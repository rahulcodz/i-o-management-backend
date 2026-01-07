-- CreateTable
CREATE TABLE "Quotation" (
    "id" SERIAL NOT NULL,
    "quotationNo" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "consigneeDetails" JSONB,
    "shipmentDetails" JSONB,
    "salesBroker" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationProduct" (
    "id" SERIAL NOT NULL,
    "quotationId" INTEGER NOT NULL,
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
    "totalNetWeight" DOUBLE PRECISION,
    "totalGrossWeight" DOUBLE PRECISION,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "materialName" TEXT NOT NULL,
    "markAsDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotationNo_key" ON "Quotation"("quotationNo");

-- AddForeignKey
ALTER TABLE "QuotationProduct" ADD CONSTRAINT "QuotationProduct_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProduct" ADD CONSTRAINT "QuotationProductProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProduct" ADD CONSTRAINT "QuotationProductUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProduct" ADD CONSTRAINT "QuotationProductPackageType_packageTypeId_fkey" FOREIGN KEY ("packageTypeId") REFERENCES "PackageType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationProduct" ADD CONSTRAINT "QuotationProductMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
