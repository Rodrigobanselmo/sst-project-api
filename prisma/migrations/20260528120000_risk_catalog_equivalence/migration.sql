-- CreateEnum
CREATE TYPE "RiskCatalogKind" AS ENUM ('GENERATE_SOURCE', 'REC_MED');

-- CreateEnum
CREATE TYPE "RiskCatalogEquivalenceType" AS ENUM ('TECHNICAL_DUPLICATE', 'SEMANTIC_ALIAS');

-- CreateTable
CREATE TABLE "risk_catalog_equivalence" (
    "id" TEXT NOT NULL,
    "kind" "RiskCatalogKind" NOT NULL,
    "equivalenceType" "RiskCatalogEquivalenceType" NOT NULL,
    "riskId" TEXT NOT NULL,
    "canonicalId" TEXT NOT NULL,
    "aliasId" TEXT NOT NULL,
    "canonicalLabel" TEXT NOT NULL,
    "aliasLabel" TEXT NOT NULL,
    "normalizedKey" TEXT,
    "confirmedById" INTEGER,
    "confirmedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_catalog_equivalence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "risk_catalog_equivalence_kind_riskId_canonicalId_idx" ON "risk_catalog_equivalence"("kind", "riskId", "canonicalId");

-- CreateIndex
CREATE INDEX "risk_catalog_equivalence_kind_riskId_aliasId_idx" ON "risk_catalog_equivalence"("kind", "riskId", "aliasId");

-- CreateIndex
CREATE INDEX "risk_catalog_equivalence_kind_riskId_normalizedKey_idx" ON "risk_catalog_equivalence"("kind", "riskId", "normalizedKey");

-- Apenas uma equivalência ativa por alias (revokedAt IS NULL)
CREATE UNIQUE INDEX "risk_catalog_equivalence_kind_aliasId_active_key" ON "risk_catalog_equivalence"("kind", "aliasId") WHERE "revokedAt" IS NULL;
