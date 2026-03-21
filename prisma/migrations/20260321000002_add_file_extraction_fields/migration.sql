-- AlterTable
ALTER TABLE "AiMessageFile" ADD COLUMN "extractedContent" TEXT;
ALTER TABLE "AiMessageFile" ADD COLUMN "extractionType" TEXT;
ALTER TABLE "AiMessageFile" ADD COLUMN "extractedAt" TIMESTAMP(3);
