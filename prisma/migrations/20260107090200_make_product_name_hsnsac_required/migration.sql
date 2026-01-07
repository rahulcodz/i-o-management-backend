/*
  Warnings:

  - You are about to drop the column `customFields` on the `Product` table. All the data in the column will be lost.
  - Made the column `hsnSac` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- First, update any NULL values in name and hsnSac columns
UPDATE "Product" SET "name" = 'Unnamed Product' WHERE "name" IS NULL;
UPDATE "Product" SET "hsnSac" = 'N/A' WHERE "hsnSac" IS NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "customFields",
ALTER COLUMN "hsnSac" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
