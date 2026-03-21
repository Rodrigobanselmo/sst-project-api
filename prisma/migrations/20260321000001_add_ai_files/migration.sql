CREATE TABLE "AiFile" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaderId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "AiFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiMessageFile" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiMessageFile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiFile_key_key" ON "AiFile"("key");
CREATE INDEX "AiFile_uploaderId_idx" ON "AiFile"("uploaderId");
CREATE INDEX "AiFile_key_idx" ON "AiFile"("key");
CREATE INDEX "AiMessageFile_messageId_idx" ON "AiMessageFile"("messageId");
CREATE INDEX "AiMessageFile_fileId_idx" ON "AiMessageFile"("fileId");
CREATE UNIQUE INDEX "AiMessageFile_messageId_fileId_key" ON "AiMessageFile"("messageId", "fileId");

ALTER TABLE "AiFile" ADD CONSTRAINT "AiFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMessageFile" ADD CONSTRAINT "AiMessageFile_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AiMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMessageFile" ADD CONSTRAINT "AiMessageFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "AiFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
