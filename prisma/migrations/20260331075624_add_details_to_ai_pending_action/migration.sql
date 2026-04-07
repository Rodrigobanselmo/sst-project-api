-- AlterTable
ALTER TABLE "AiMessage" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AiPendingAction" ADD COLUMN     "details" JSONB;
