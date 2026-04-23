-- Rename PackageType fields to match new payload contract and add optional code
ALTER TABLE "PackageType" RENAME COLUMN "packageType" TO "unitName";
ALTER TABLE "PackageType" RENAME COLUMN "markAsDefault" TO "is_default";
ALTER TABLE "PackageType" ADD COLUMN "code" TEXT;
