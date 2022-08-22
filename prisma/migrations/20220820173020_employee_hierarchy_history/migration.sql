/*
  Warnings:

  - You are about to drop the `_EmployeeToWorkspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmployeeToWorkspace" DROP CONSTRAINT "_EmployeeToWorkspace_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeToWorkspace" DROP CONSTRAINT "_EmployeeToWorkspace_B_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "hierarchyId" DROP NOT NULL;

-- DropTable
DROP TABLE "_EmployeeToWorkspace";
