-- CreateEnum
CREATE TYPE "AiPendingActionServiceEnum" AS ENUM ('UPSERT_RISK_DATA', 'UPSERT_MANY_RISK_DATA');

-- CreateEnum
CREATE TYPE "AiPendingActionStatusEnum" AS ENUM ('PENDING', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "AiPendingAction" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "service" "AiPendingActionServiceEnum" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "AiPendingActionStatusEnum" NOT NULL DEFAULT 'PENDING',
    "summary" TEXT,
    "executedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPendingAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiPendingAction_userId_idx" ON "AiPendingAction"("userId");

-- CreateIndex
CREATE INDEX "AiPendingAction_companyId_idx" ON "AiPendingAction"("companyId");

-- CreateIndex
CREATE INDEX "AiPendingAction_messageId_idx" ON "AiPendingAction"("messageId");

-- CreateIndex
CREATE INDEX "AiPendingAction_status_idx" ON "AiPendingAction"("status");

-- CreateIndex
CREATE INDEX "AiPendingAction_created_at_idx" ON "AiPendingAction"("created_at");

-- AddForeignKey
ALTER TABLE "AiPendingAction" ADD CONSTRAINT "AiPendingAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPendingAction" ADD CONSTRAINT "AiPendingAction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPendingAction" ADD CONSTRAINT "AiPendingAction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AiMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
