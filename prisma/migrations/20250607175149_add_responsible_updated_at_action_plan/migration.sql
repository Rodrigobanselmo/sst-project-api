-- AlterTable
ALTER TABLE "RiskFactorDataRec" ADD COLUMN     "responsible_notified_at" TIMESTAMP(3),
ADD COLUMN     "responsible_updated_at" TIMESTAMP(3);

-- DropEnum
DROP TYPE "RiskSubTypeEnum";

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailLog_email_idx" ON "EmailLog"("email");

UPDATE "RiskFactorDataRec"
SET
    "responsible_updated_at" = '2025-01-01 00:00:00',
    "responsible_notified_at" = '2025-03-01 00:00:00';