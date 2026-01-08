/*
  Warnings:

  - You are about to drop the column `optional` on the `Unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "optional",
ADD COLUMN     "advanced" JSONB;
