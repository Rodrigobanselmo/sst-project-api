/*
  Warnings:

  - You are about to drop the column `birthdate` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CoverTypeEnum" AS ENUM ('PGR', 'PCSMO');

-- CreateEnum
CREATE TYPE "EmployeeHierarchyMotiveTypeEnum" AS ENUM ('ADM', 'TRANS', 'ALOC', 'PROM', 'TRANS_PROM', 'DEM');

-- CreateEnum
CREATE TYPE "SexTypeEnum" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "birthdate",
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "cidId" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "esocialCode" TEXT,
ADD COLUMN     "isComorbidity" BOOLEAN DEFAULT false,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sex" "SexTypeEnum",
ADD COLUMN     "shiftId" INTEGER,
ADD COLUMN     "socialName" TEXT;

-- CreateTable
CREATE TABLE "Cid" (
    "cid" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Cid_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "CompanyShift" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCover" (
    "id" SERIAL NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "acceptType" "CoverTypeEnum"[],

    CONSTRAINT "DocumentCover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeHierarchyHistory" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "motive" "EmployeeHierarchyMotiveTypeEnum" NOT NULL,
    "startDate" TIMESTAMP(3),
    "hierarchyId" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "EmployeeHierarchyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeExamsHistory" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "doneDate" TIMESTAMP(3),
    "validityInMonths" INTEGER,
    "time" TEXT,
    "examId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "EmployeeExamsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyShift_id_companyId_key" ON "CompanyShift"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCover_id_companyId_key" ON "DocumentCover"("id", "companyId");

-- AddForeignKey
ALTER TABLE "CompanyShift" ADD CONSTRAINT "CompanyShift_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentCover" ADD CONSTRAINT "DocumentCover_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_cidId_fkey" FOREIGN KEY ("cidId") REFERENCES "Cid"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "CompanyShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeHierarchyHistory" ADD CONSTRAINT "EmployeeHierarchyHistory_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeHierarchyHistory" ADD CONSTRAINT "EmployeeHierarchyHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExamsHistory" ADD CONSTRAINT "EmployeeExamsHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
