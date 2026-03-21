-- CreateEnum
CREATE TYPE "AiMessageRoleEnum" AS ENUM ('user', 'assistant', 'tool');

-- CreateTable
CREATE TABLE "AiThread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Novo Chat',
    "userId" INTEGER NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AiThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" "AiMessageRoleEnum" NOT NULL,
    "content" TEXT NOT NULL,
    "toolName" TEXT,
    "toolStatus" TEXT,
    "toolDescription" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiThread_userId_idx" ON "AiThread"("userId");

-- CreateIndex
CREATE INDEX "AiThread_created_at_idx" ON "AiThread"("created_at");

-- CreateIndex
CREATE INDEX "AiThread_deleted_at_idx" ON "AiThread"("deleted_at");

-- CreateIndex
CREATE INDEX "AiMessage_threadId_idx" ON "AiMessage"("threadId");

-- CreateIndex
CREATE INDEX "AiMessage_created_at_idx" ON "AiMessage"("created_at");

-- AddForeignKey
ALTER TABLE "AiThread" ADD CONSTRAINT "AiThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "AiThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
