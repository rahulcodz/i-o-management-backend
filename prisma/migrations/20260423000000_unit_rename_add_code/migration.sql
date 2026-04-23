-- Rename Unit fields to match new payload contract and add optional code
ALTER TABLE "Unit" RENAME COLUMN "orderUnit" TO "unitName";
ALTER TABLE "Unit" RENAME COLUMN "default" TO "is_default";
ALTER TABLE "Unit" ADD COLUMN "code" TEXT;
