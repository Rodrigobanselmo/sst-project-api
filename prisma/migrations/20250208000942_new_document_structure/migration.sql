-- CreateTable
CREATE TABLE "DocumentControl" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,

    CONSTRAINT "DocumentControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentControlFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "file_id" TEXT NOT NULL,
    "document_control_id" INTEGER NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "DocumentControlFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "should_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "SystemFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentControl_type_idx" ON "DocumentControl"("type");

-- CreateIndex
CREATE INDEX "DocumentControl_company_id_idx" ON "DocumentControl"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentControl_id_company_id_key" ON "DocumentControl"("id", "company_id");

-- CreateIndex
CREATE INDEX "DocumentControlFile_company_id_idx" ON "DocumentControlFile"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentControlFile_id_company_id_key" ON "DocumentControlFile"("id", "company_id");

-- CreateIndex
CREATE INDEX "SystemFile_company_id_idx" ON "SystemFile"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "SystemFile_id_company_id_key" ON "SystemFile"("id", "company_id");

-- AddForeignKey
ALTER TABLE "DocumentControl" ADD CONSTRAINT "DocumentControl_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentControl" ADD CONSTRAINT "DocumentControl_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentControlFile" ADD CONSTRAINT "DocumentControlFile_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "SystemFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentControlFile" ADD CONSTRAINT "DocumentControlFile_document_control_id_fkey" FOREIGN KEY ("document_control_id") REFERENCES "DocumentControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentControlFile" ADD CONSTRAINT "DocumentControlFile_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemFile" ADD CONSTRAINT "SystemFile_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
