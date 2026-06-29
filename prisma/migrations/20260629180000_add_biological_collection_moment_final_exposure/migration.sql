-- 4P.2.2 — Adiciona o momento de coleta ACGIH/BEI "Final da exposição" ao enum
-- BiologicalCollectionMomentEnum. Migration ADITIVA e isolada: apenas um novo
-- valor de enum. Não altera tabelas, não remove/renomeia valores e não altera
-- dados existentes (sem backfill).
ALTER TYPE "BiologicalCollectionMomentEnum" ADD VALUE IF NOT EXISTS 'FINAL_EXPOSURE';
