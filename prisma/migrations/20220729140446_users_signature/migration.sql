-- DropIndex
DROP INDEX "_RiskFactorGroupDataToUser_AB_unique";

-- DropIndex
DROP INDEX "_RiskFactorGroupDataToUser_B_index";

-- AlterTable
ALTER TABLE "_RiskFactorGroupDataToUser" ADD COLUMN     "isSigner" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "_RiskFactorGroupDataToUser_pkey" PRIMARY KEY ("B", "A");
