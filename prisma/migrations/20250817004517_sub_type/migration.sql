-- CreateEnum
CREATE TYPE "RiskSubTypeEnum" AS ENUM ('PSICOSOCIAL');

-- AlterTable
ALTER TABLE "RiskSubType" ADD COLUMN     "sub_type" "RiskSubTypeEnum" NOT NULL DEFAULT 'PSICOSOCIAL';
