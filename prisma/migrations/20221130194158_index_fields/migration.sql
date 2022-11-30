-- CreateIndex
CREATE INDEX "Absenteeism_startDate_idx" ON "Absenteeism"("startDate");

-- CreateIndex
CREATE INDEX "Absenteeism_endDate_idx" ON "Absenteeism"("endDate");

-- CreateIndex
CREATE INDEX "Cid_description_idx" ON "Cid"("description");

-- CreateIndex
CREATE INDEX "Cities_name_idx" ON "Cities"("name");
