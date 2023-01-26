-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "configJson" JSONB,
ADD COLUMN     "nextAlert" TIMESTAMP(3);
