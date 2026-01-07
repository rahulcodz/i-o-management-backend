-- RenameForeignKey
ALTER TABLE "QuotationProduct" RENAME CONSTRAINT "QuotationProductMaterial_materialId_fkey" TO "QuotationProduct_materialId_fkey";

-- RenameForeignKey
ALTER TABLE "QuotationProduct" RENAME CONSTRAINT "QuotationProductPackageType_packageTypeId_fkey" TO "QuotationProduct_packageTypeId_fkey";

-- RenameForeignKey
ALTER TABLE "QuotationProduct" RENAME CONSTRAINT "QuotationProductProduct_productId_fkey" TO "QuotationProduct_productId_fkey";

-- RenameForeignKey
ALTER TABLE "QuotationProduct" RENAME CONSTRAINT "QuotationProductUnit_unitId_fkey" TO "QuotationProduct_unitId_fkey";
