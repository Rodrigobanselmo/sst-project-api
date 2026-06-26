-- CreateEnum
CREATE TYPE "PcmsoExamRiskRuleScopeEnum" AS ENUM ('RISK', 'GROUP', 'CATEGORY', 'AGENT');

-- CreateEnum
CREATE TYPE "PcmsoExamRiskRuleSourceEnum" AS ENUM ('NR_07', 'SIMPLE_SST', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PcmsoExamRiskRuleStatusEnum" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED');

-- CreateTable
CREATE TABLE "PcmsoExamRiskRule" (
    "id" TEXT NOT NULL,
    "scope" "PcmsoExamRiskRuleScopeEnum" NOT NULL,
    "riskFactorId" TEXT,
    "riskCategory" "RiskFactorsEnum",
    "riskSubTypeId" INTEGER,
    "agentCas" TEXT,
    "agentName" TEXT,
    "agentNameNormalized" TEXT,
    "riskNameSnapshot" TEXT,
    "subTypeNameSnapshot" TEXT,
    "source" "PcmsoExamRiskRuleSourceEnum" NOT NULL,
    "status" "PcmsoExamRiskRuleStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "rationale" TEXT,
    "sourceIndicatorId" TEXT,
    "isCurated" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PcmsoExamRiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PcmsoExamRiskRuleExam" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "examId" INTEGER,
    "examNameSnapshot" TEXT,
    "isAdmission" BOOLEAN NOT NULL DEFAULT false,
    "isPeriodic" BOOLEAN NOT NULL DEFAULT false,
    "isChange" BOOLEAN NOT NULL DEFAULT false,
    "isReturn" BOOLEAN NOT NULL DEFAULT false,
    "isDismissal" BOOLEAN NOT NULL DEFAULT false,
    "isMale" BOOLEAN NOT NULL DEFAULT true,
    "isFemale" BOOLEAN NOT NULL DEFAULT true,
    "validityInMonths" INTEGER,
    "considerBetweenDays" INTEGER,
    "fromAge" INTEGER,
    "toAge" INTEGER,
    "minRiskDegree" INTEGER,
    "minRiskDegreeQuantity" INTEGER,
    "collectionToleranceDays" INTEGER,
    "collectionMoment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PcmsoExamRiskRuleExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_scope_idx" ON "PcmsoExamRiskRule"("scope");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_status_idx" ON "PcmsoExamRiskRule"("status");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_source_idx" ON "PcmsoExamRiskRule"("source");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_riskFactorId_idx" ON "PcmsoExamRiskRule"("riskFactorId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_riskCategory_idx" ON "PcmsoExamRiskRule"("riskCategory");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_riskSubTypeId_idx" ON "PcmsoExamRiskRule"("riskSubTypeId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_agentCas_idx" ON "PcmsoExamRiskRule"("agentCas");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_agentNameNormalized_idx" ON "PcmsoExamRiskRule"("agentNameNormalized");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRule_sourceIndicatorId_idx" ON "PcmsoExamRiskRule"("sourceIndicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PcmsoExamRiskRule_source_sourceIndicatorId_key" ON "PcmsoExamRiskRule"("source", "sourceIndicatorId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleExam_ruleId_idx" ON "PcmsoExamRiskRuleExam"("ruleId");

-- CreateIndex
CREATE INDEX "PcmsoExamRiskRuleExam_examId_idx" ON "PcmsoExamRiskRuleExam"("examId");

-- AddForeignKey
ALTER TABLE "PcmsoExamRiskRuleExam" ADD CONSTRAINT "PcmsoExamRiskRuleExam_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "PcmsoExamRiskRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

