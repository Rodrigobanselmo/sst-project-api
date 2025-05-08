/*
  Warnings:

  - A unique constraint covering the columns `[company_id,project_id,action_plan_id,sequential_id]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequential_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Status" ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "sequential_id" INTEGER;

-- CreateIndex
CREATE INDEX "Task_company_id_project_id_action_plan_id_idx" ON "Task"("company_id", "project_id", "action_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "Task_company_id_project_id_action_plan_id_sequential_id_key" ON "Task"("company_id", "project_id", "action_plan_id", "sequential_id");

-- Function to calculate the next sequential_id
CREATE OR REPLACE FUNCTION set_task_sequential_id()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(sequential_id), 0) + 1
  INTO NEW.sequential_id
  FROM "Task"
  WHERE
    "company_id" = NEW."company_id"
    AND ("project_id" IS NOT DISTINCT FROM NEW."project_id") -- Handles NULLs correctly
    AND ("action_plan_id" IS NOT DISTINCT FROM NEW."action_plan_id"); -- Handles NULLs correctly
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before insert
CREATE TRIGGER trg_set_task_sequential_id
BEFORE INSERT ON "Task"
FOR EACH ROW
EXECUTE FUNCTION set_task_sequential_id();