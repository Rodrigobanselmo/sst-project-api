-- AlterTable
ALTER TABLE "Protocol" ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "system" BOOLEAN;

-- AlterTable
ALTER TABLE "ProtocolToRisk" ADD COLUMN     "minRiskDegree" INTEGER DEFAULT 1,
ADD COLUMN     "minRiskDegreeQuantity" INTEGER DEFAULT 1;
