-- CreateEnum
CREATE TYPE "ProfessionalRespTypeEnum" AS ENUM ('AMB', 'BIO');

-- CreateTable
CREATE TABLE "ProfessionalCouncilResponsible" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "professionalCouncilId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" "ProfessionalRespTypeEnum" NOT NULL DEFAULT 'AMB',

    CONSTRAINT "ProfessionalCouncilResponsible_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalCouncilResponsible_companyId_professionalCounci_key" ON "ProfessionalCouncilResponsible"("companyId", "professionalCouncilId", "startDate");

-- AddForeignKey
ALTER TABLE "ProfessionalCouncilResponsible" ADD CONSTRAINT "ProfessionalCouncilResponsible_professionalCouncilId_fkey" FOREIGN KEY ("professionalCouncilId") REFERENCES "ProfessionalCouncil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalCouncilResponsible" ADD CONSTRAINT "ProfessionalCouncilResponsible_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
