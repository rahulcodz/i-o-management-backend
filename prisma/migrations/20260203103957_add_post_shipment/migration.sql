-- CreateTable
CREATE TABLE "PackagingList" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "cartonCount" INTEGER NOT NULL,
    "cartonInfo" JSONB,
    "group" JSONB,
    "isWoodenbox" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostShipment" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "grade" TEXT,
    "rawMaterial" TEXT,
    "list" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostShipment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackagingList" ADD CONSTRAINT "PackagingList_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShipment" ADD CONSTRAINT "PostShipment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShipment" ADD CONSTRAINT "PostShipment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
