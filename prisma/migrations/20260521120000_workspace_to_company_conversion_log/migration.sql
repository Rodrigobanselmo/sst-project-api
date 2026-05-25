-- CreateTable
CREATE TABLE "WorkspaceToCompanyConversionLog" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "executed_by_user_id" INTEGER NOT NULL,
    "source_company_id" TEXT NOT NULL,
    "source_workspace_id" TEXT NOT NULL,
    "target_company_id" TEXT,
    "target_workspace_id" TEXT,
    "company_group_id" INTEGER NOT NULL,
    "summary" JSONB,
    "error_message" TEXT,

    CONSTRAINT "WorkspaceToCompanyConversionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceToCompanyConversionLog_source_company_id_idx" ON "WorkspaceToCompanyConversionLog"("source_company_id");

-- CreateIndex
CREATE INDEX "WorkspaceToCompanyConversionLog_source_workspace_id_idx" ON "WorkspaceToCompanyConversionLog"("source_workspace_id");

-- CreateIndex
CREATE INDEX "WorkspaceToCompanyConversionLog_created_at_idx" ON "WorkspaceToCompanyConversionLog"("created_at");
