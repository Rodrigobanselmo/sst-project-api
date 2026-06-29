-- 4P.1A — Fundação de schema para indicador oficial ACGIH/BEI.
-- Migration ADITIVA e isolada: não cria dados, não faz backfill, não altera
-- dados existentes e NÃO usa os novos valores de enum em DML.
-- Registros NR-7 existentes permanecem válidos (colunas NR-7 já preenchidas);
-- a obrigatoriedade lógica da NR-7 passa a ser garantida em código.

-- AlterEnum: apenas adição de valores (sem remoção/renomeação)
ALTER TYPE "BiologicalNormativeSourceEnum" ADD VALUE IF NOT EXISTS 'ACGIH_BEI';
ALTER TYPE "BiologicalIndicatorDataOriginEnum" ADD VALUE IF NOT EXISTS 'ACGIH_BEI_COMPARISON';

-- AlterTable: novas colunas nullable de proveniência ACGIH/BEI + relaxa NOT NULL
-- somente dos campos específicos da NR-7 (Anexo I).
ALTER TABLE "OccupationalBiologicalIndicator"
  ADD COLUMN "acgihBeiIndicatorId" TEXT,
  ADD COLUMN "sourcePage" TEXT,
  ALTER COLUMN "annex" DROP NOT NULL,
  ALTER COLUMN "tableNumber" DROP NOT NULL,
  ALTER COLUMN "indicatorType" DROP NOT NULL,
  ALTER COLUMN "normativeVersion" DROP NOT NULL;

-- CreateIndex: unique de proveniência (promoção 1:1 idempotente). Em coluna
-- nullable, múltiplos NULL são permitidos (registros NR-7 não conflitam).
CREATE UNIQUE INDEX "OccupationalBiologicalIndicator_acgihBeiIndicatorId_key" ON "OccupationalBiologicalIndicator"("acgihBeiIndicatorId");

-- AddForeignKey: proveniência ACGIH/BEI → base de origem (ON DELETE SET NULL).
ALTER TABLE "OccupationalBiologicalIndicator" ADD CONSTRAINT "OccupationalBiologicalIndicator_acgihBeiIndicatorId_fkey" FOREIGN KEY ("acgihBeiIndicatorId") REFERENCES "PcmsoAcgihBeiIndicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
