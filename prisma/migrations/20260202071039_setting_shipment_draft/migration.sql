-- CreateTable
CREATE TABLE "DocumentTemplate" (
    "id" SERIAL NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentContent" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreShipment" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "documentTemplateId" INTEGER NOT NULL,
    "numberOfContainer" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "vendorId" INTEGER,
    "grossWeight" DOUBLE PRECISION,
    "netWeight" DOUBLE PRECISION,
    "tareWeight" DOUBLE PRECISION,
    "countryOfOrigin" TEXT,
    "storage" TEXT,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BLDraft" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "shippingLine" TEXT NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "blType" TEXT,
    "vesselNumber" TEXT,
    "freight" TEXT,
    "consigneeId" INTEGER NOT NULL,
    "notifyBuyerId" INTEGER,
    "notifyOtherPartyId" INTEGER,
    "otherDetail" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BLDraft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentTemplate" ADD CONSTRAINT "DocumentTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreShipment" ADD CONSTRAINT "PreShipment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreShipment" ADD CONSTRAINT "PreShipment_documentTemplateId_fkey" FOREIGN KEY ("documentTemplateId") REFERENCES "DocumentTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreShipment" ADD CONSTRAINT "PreShipment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreShipment" ADD CONSTRAINT "PreShipment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BLDraft" ADD CONSTRAINT "BLDraft_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BLDraft" ADD CONSTRAINT "BLDraft_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BLDraft" ADD CONSTRAINT "BLDraft_notifyBuyerId_fkey" FOREIGN KEY ("notifyBuyerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BLDraft" ADD CONSTRAINT "BLDraft_notifyOtherPartyId_fkey" FOREIGN KEY ("notifyOtherPartyId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
