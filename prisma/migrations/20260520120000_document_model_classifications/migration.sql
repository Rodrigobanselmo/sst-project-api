-- CreateEnum
CREATE TYPE "DocumentModelClassificationEnum" AS ENUM (
  'GRO_PGR',
  'SOMENTE_PGR',
  'COM_FRPS',
  'SEM_FRPS',
  'NR18',
  'TERCEIROS',
  'SIMPLIFICADO',
  'BACKUP'
);

-- AlterTable
ALTER TABLE "DocumentModel" ADD COLUMN "classifications" "DocumentModelClassificationEnum"[] NOT NULL DEFAULT ARRAY[]::"DocumentModelClassificationEnum"[];
