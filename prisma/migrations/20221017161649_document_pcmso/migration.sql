-- AlterTable
ALTER TABLE "RiskFactorDocument" ADD COLUMN     "pcmsoId" TEXT,
ALTER COLUMN "riskGroupId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DocumentPCMSO" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "elaboratedBy" TEXT,
    "coordinatorBy" TEXT,
    "revisionBy" TEXT,
    "approvedBy" TEXT,
    "validityStart" TIMESTAMP(3),
    "validityEnd" TIMESTAMP(3),
    "status" "StatusEnum" NOT NULL DEFAULT 'PROGRESS',

    CONSTRAINT "DocumentPCMSO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentPCMSOToProfessional" (
    "B" TEXT NOT NULL,
    "A" INTEGER NOT NULL,
    "isSigner" BOOLEAN NOT NULL DEFAULT false,
    "isElaborator" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "_DocumentPCMSOToProfessional_pkey" PRIMARY KEY ("B","A")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentPCMSO_companyId_key" ON "DocumentPCMSO"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentPCMSO_id_companyId_key" ON "DocumentPCMSO"("id", "companyId");

-- AddForeignKey
ALTER TABLE "DocumentPCMSO" ADD CONSTRAINT "DocumentPCMSO_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorDocument" ADD CONSTRAINT "RiskFactorDocument_pcmsoId_companyId_fkey" FOREIGN KEY ("pcmsoId", "companyId") REFERENCES "DocumentPCMSO"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentPCMSOToProfessional" ADD CONSTRAINT "_DocumentPCMSOToProfessional_B_fkey" FOREIGN KEY ("B") REFERENCES "DocumentPCMSO"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentPCMSOToProfessional" ADD CONSTRAINT "_DocumentPCMSOToProfessional_A_fkey" FOREIGN KEY ("A") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
