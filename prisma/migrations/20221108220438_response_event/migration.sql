/*
  Warnings:

  - You are about to drop the column `responseXml` on the `EmployeeESocialEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeESocialBatch" ADD COLUMN     "response" JSONB;

-- AlterTable
ALTER TABLE "EmployeeESocialEvent" DROP COLUMN "responseXml",
ADD COLUMN     "response" JSONB;
