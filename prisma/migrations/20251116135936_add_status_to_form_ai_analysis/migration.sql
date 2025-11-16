-- CreateEnum
CREATE TYPE "FormAiAnalysisStatusEnum" AS ENUM ('PROCESSING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "FormAiAnalysis" ADD COLUMN     "status" "FormAiAnalysisStatusEnum" NOT NULL DEFAULT 'PROCESSING',
ALTER COLUMN "probability" DROP NOT NULL,
ALTER COLUMN "confidence" DROP NOT NULL,
ALTER COLUMN "analysis" DROP NOT NULL;
