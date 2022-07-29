-- DropIndex
DROP INDEX "_engs_AB_unique";

-- DropIndex
DROP INDEX "_engs_B_index";

-- AlterTable
ALTER TABLE "_engs" ADD COLUMN     "efficientlyCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD CONSTRAINT "_engs_pkey" PRIMARY KEY ("B", "A");
