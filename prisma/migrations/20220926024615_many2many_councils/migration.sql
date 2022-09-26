-- CreateTable
CREATE TABLE "ProfessionalCouncil" (
    "id" SERIAL NOT NULL,
    "councilType" TEXT NOT NULL,
    "councilUF" TEXT NOT NULL,
    "councilId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "professionalId" INTEGER NOT NULL,

    CONSTRAINT "ProfessionalCouncil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalCouncil_councilType_councilUF_councilId_profess_key" ON "ProfessionalCouncil"("councilType", "councilUF", "councilId", "professionalId");

-- AddForeignKey
ALTER TABLE "ProfessionalCouncil" ADD CONSTRAINT "ProfessionalCouncil_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
