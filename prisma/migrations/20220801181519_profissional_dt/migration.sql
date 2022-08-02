/*
  Warnings:

  - The primary key for the `Professional` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crea` on the `Professional` table. All the data in the column will be lost.
  - The `id` column on the `Professional` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id,companyId]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Professional` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `A` on the `_ProfessionalToRiskFactorGroupData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProfessionalTypeEnum" AS ENUM ('DOCTOR', 'NURSE', 'SPEECH_THERAPIST', 'TECHNICIAN', 'ENGINEER');

-- DropForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" DROP CONSTRAINT "_ProfessionalToRiskFactorGroupData_A_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "blockResignationExam" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "esocialStart" TIMESTAMP(3),
ADD COLUMN     "numAsos" INTEGER;

-- AlterTable
ALTER TABLE "CompanyGroup" ADD COLUMN     "blockResignationExam" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "esocialStart" TIMESTAMP(3),
ADD COLUMN     "numAsos" INTEGER;

-- AlterTable
ALTER TABLE "Professional" DROP CONSTRAINT "Professional_pkey",
DROP COLUMN "crea",
ADD COLUMN     "councilId" TEXT,
ADD COLUMN     "councilType" TEXT,
ADD COLUMN     "councilUF" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "type" "ProfessionalTypeEnum" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Professional_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "councilId" TEXT,
ADD COLUMN     "councilType" TEXT,
ADD COLUMN     "councilUF" TEXT,
ADD COLUMN     "crm" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "_ProfessionalToRiskFactorGroupData" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Professional_id_companyId_key" ON "Professional"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfessionalToRiskFactorGroupData_AB_unique" ON "_ProfessionalToRiskFactorGroupData"("A", "B");

-- AddForeignKey
ALTER TABLE "_ProfessionalToRiskFactorGroupData" ADD CONSTRAINT "_ProfessionalToRiskFactorGroupData_A_fkey" FOREIGN KEY ("A") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
