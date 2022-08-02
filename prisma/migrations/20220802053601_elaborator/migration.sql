-- AlterTable
ALTER TABLE "_ProfessionalToRiskFactorGroupData" ADD COLUMN     "isElaborator" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "_RiskFactorGroupDataToUser" ADD COLUMN     "isElaborator" BOOLEAN NOT NULL DEFAULT false;
