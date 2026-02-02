-- CreateTable
CREATE TABLE "COAParameter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "method" TEXT,
    "limit" DOUBLE PRECISION,
    "result" TEXT,
    "unit" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "COAParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "COASetting" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "group" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "COASetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductLabelParameter" (
    "id" SERIAL NOT NULL,
    "parameterName" TEXT NOT NULL,
    "defaultValue" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductLabelParameter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "COASetting" ADD CONSTRAINT "COASetting_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
