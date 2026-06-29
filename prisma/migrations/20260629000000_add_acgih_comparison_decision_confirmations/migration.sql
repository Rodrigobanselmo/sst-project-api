-- 4O.5 — Adiciona desfechos de auditoria ao enum de decisão técnica da
-- comparação ACGIH/BEI × NR-7 × Biblioteca. Migration ADITIVA e isolada:
-- apenas novos valores de enum. Não altera tabelas, não remove/renomeia
-- valores e não altera dados existentes.
ALTER TYPE "PcmsoAcgihBeiComparisonDecisionEnum" ADD VALUE IF NOT EXISTS 'MATCH_CONFIRMED';
ALTER TYPE "PcmsoAcgihBeiComparisonDecisionEnum" ADD VALUE IF NOT EXISTS 'NO_MATCH_CONFIRMED';
