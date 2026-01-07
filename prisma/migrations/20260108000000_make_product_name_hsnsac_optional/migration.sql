-- AlterTable: Make name and hsnSac optional (nullable) in Product table
-- This allows packages to be created without these fields

-- First, alter the columns to allow NULL values
ALTER TABLE "Product" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "hsnSac" DROP NOT NULL;

-- Then, set any empty strings to NULL for consistency
UPDATE "Product" SET "name" = NULL WHERE "name" = '';
UPDATE "Product" SET "hsnSac" = NULL WHERE "hsnSac" = '';
