-- CreateIndex
CREATE INDEX "Employee_hierarchyId_idx" ON "Employee"("hierarchyId");

-- CreateIndex
CREATE INDEX "Employee_hierarchyId_companyId_idx" ON "Employee"("hierarchyId", "companyId");

-- CreateIndex
CREATE INDEX "FormParticipantsAnswers_form_application_id_idx" ON "FormParticipantsAnswers"("form_application_id");

-- CreateIndex
CREATE INDEX "FormParticipantsAnswers_employee_id_idx" ON "FormParticipantsAnswers"("employee_id");

-- CreateIndex
CREATE INDEX "FormParticipantsAnswers_status_idx" ON "FormParticipantsAnswers"("status");

-- CreateIndex
CREATE INDEX "FormParticipantsAnswers_form_application_id_status_idx" ON "FormParticipantsAnswers"("form_application_id", "status");

-- CreateIndex
CREATE INDEX "FormParticipantsHierarchy_form_participants_id_idx" ON "FormParticipantsHierarchy"("form_participants_id");

-- CreateIndex
CREATE INDEX "FormParticipantsHierarchy_hierarchy_id_idx" ON "FormParticipantsHierarchy"("hierarchy_id");

-- CreateIndex
CREATE INDEX "FormParticipantsWorkspace_form_participants_id_idx" ON "FormParticipantsWorkspace"("form_participants_id");

-- CreateIndex
CREATE INDEX "FormParticipantsWorkspace_workspace_id_idx" ON "FormParticipantsWorkspace"("workspace_id");
