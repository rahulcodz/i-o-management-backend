-- AlterTable
ALTER TABLE "PackagingList" ADD COLUMN     "boxLocationList" JSONB,
ADD COLUMN     "woodenBoxCount" INTEGER,
ADD COLUMN     "woodenBoxList" JSONB;
