-- CreateEnum
CREATE TYPE "CompanyEmviromentTypesEnum" AS ENUM ('SUPPORT', 'OPERATION', 'ADMINISTRATIVE');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "email" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "operatonTime" TEXT,
ADD COLUMN     "responsableName" TEXT,
ADD COLUMN     "riskDegree" INTEGER,
ADD COLUMN     "values" TEXT,
ADD COLUMN     "vision" TEXT;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "cnpj" TEXT;

-- CreateTable
CREATE TABLE "CompanyEnvironment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vision" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "CompanyEmviromentTypesEnum" NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "parentEnvironmentId" TEXT NOT NULL,

    CONSTRAINT "CompanyEnvironment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyEnvironmentToRiskFactors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyEnvironmentToHierarchy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyEnvironmentToRiskFactors_AB_unique" ON "_CompanyEnvironmentToRiskFactors"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyEnvironmentToRiskFactors_B_index" ON "_CompanyEnvironmentToRiskFactors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyEnvironmentToHierarchy_AB_unique" ON "_CompanyEnvironmentToHierarchy"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyEnvironmentToHierarchy_B_index" ON "_CompanyEnvironmentToHierarchy"("B");

-- AddForeignKey
ALTER TABLE "CompanyEnvironment" ADD CONSTRAINT "CompanyEnvironment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyEnvironment" ADD CONSTRAINT "CompanyEnvironment_parentEnvironmentId_fkey" FOREIGN KEY ("parentEnvironmentId") REFERENCES "CompanyEnvironment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyEnvironmentToRiskFactors" ADD FOREIGN KEY ("A") REFERENCES "CompanyEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyEnvironmentToRiskFactors" ADD FOREIGN KEY ("B") REFERENCES "RiskFactors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyEnvironmentToHierarchy" ADD FOREIGN KEY ("A") REFERENCES "CompanyEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyEnvironmentToHierarchy" ADD FOREIGN KEY ("B") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
