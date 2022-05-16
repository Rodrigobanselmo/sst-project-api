-- CreateEnum
CREATE TYPE "CompanyTypesEnum" AS ENUM ('MATRIZ', 'FILIAL', 'MASTER');

-- CreateEnum
CREATE TYPE "HierarchyEnum" AS ENUM ('DIRECTORY', 'MANAGEMENT', 'SECTOR', 'SUB_SECTOR', 'OFFICE', 'SUB_OFFICE');

-- CreateEnum
CREATE TYPE "RiskFactorsEnum" AS ENUM ('BIO', 'QUI', 'FIS', 'ERG', 'ACI');

-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('ACTIVE', 'PROGRESS', 'INACTIVE', 'PENDING', 'CANCELED');

-- CreateEnum
CREATE TYPE "MeasuresTypeEnum" AS ENUM ('ADM', 'ENG');

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" SERIAL NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'PROGRESS',
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id","companyId")
);

-- CreateTable
CREATE TABLE "ChecklistData" (
    "json" JSONB NOT NULL,
    "companyId" TEXT NOT NULL,
    "checklistId" INTEGER NOT NULL,

    CONSTRAINT "ChecklistData_pkey" PRIMARY KEY ("checklistId","companyId")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fantasy" TEXT,
    "description" TEXT,
    "size" TEXT,
    "phone" TEXT,
    "legal_nature" TEXT,
    "cadastral_situation" TEXT,
    "activity_start_date" TEXT,
    "cadastral_situation_date" TEXT,
    "legal_nature_code" TEXT,
    "cadastral_situation_description" TEXT,
    "isConsulting" BOOLEAN NOT NULL DEFAULT false,
    "licenseId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "type" "CompanyTypesEnum" NOT NULL DEFAULT E'MATRIZ',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "applyingServiceCompanyId" TEXT NOT NULL,
    "receivingServiceCompanyId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("applyingServiceCompanyId","receivingServiceCompanyId")
);

-- CreateTable
CREATE TABLE "DatabaseTable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatabaseTable_pkey" PRIMARY KEY ("id","companyId")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "workplaceId" TEXT NOT NULL,
    "hierarchyId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id","companyId")
);

-- CreateTable
CREATE TABLE "Epi" (
    "id" SERIAL NOT NULL,
    "ca" TEXT NOT NULL,
    "isValid" BOOLEAN,
    "national" BOOLEAN NOT NULL DEFAULT true,
    "expiredDate" TIMESTAMP(3),
    "description" TEXT NOT NULL DEFAULT E'',
    "report" TEXT NOT NULL DEFAULT E'',
    "restriction" TEXT NOT NULL DEFAULT E'',
    "observation" TEXT NOT NULL DEFAULT E'',
    "equipment" TEXT NOT NULL DEFAULT E'',
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Epi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerateSource" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',

    CONSTRAINT "GenerateSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hierarchy" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "type" "HierarchyEnum" NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "realDescription" TEXT NOT NULL DEFAULT E'',
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "parentId" TEXT,
    "workplaceId" TEXT NOT NULL,

    CONSTRAINT "Hierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomogeneousGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomogeneousGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InviteUsers" (
    "id" TEXT NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roles" TEXT[],
    "permissions" TEXT[],

    CONSTRAINT "InviteUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecMed" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "recName" TEXT,
    "medName" TEXT,
    "companyId" TEXT NOT NULL,
    "generateSourceId" TEXT,
    "system" BOOLEAN NOT NULL,
    "medType" "MeasuresTypeEnum",
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecMed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFactors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 0,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "appendix" TEXT,
    "risk" TEXT,
    "propagation" TEXT[],
    "exame" TEXT,
    "symptoms" TEXT,
    "method" TEXT,
    "unit" TEXT,
    "cas" TEXT,
    "breather" TEXT,
    "nr15lt" TEXT,
    "twa" TEXT,
    "stel" TEXT,
    "ipvs" TEXT,
    "pv" TEXT,
    "pe" TEXT,
    "carnogenicityACGIH" TEXT,
    "carnogenicityLinach" TEXT,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "type" "RiskFactorsEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "representAll" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RiskFactors_pkey" PRIMARY KEY ("id","companyId")
);

-- CreateTable
CREATE TABLE "RiskFactorGroupData" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "source" TEXT,
    "elaboratedBy" TEXT,
    "revisionBy" TEXT,
    "approvedBy" TEXT,
    "documentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusEnum" NOT NULL DEFAULT E'PROGRESS',

    CONSTRAINT "RiskFactorGroupData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFactorData" (
    "id" TEXT NOT NULL,
    "probability" INTEGER,
    "probabilityAfter" INTEGER,
    "companyId" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "homogeneousGroupId" TEXT,
    "hierarchyId" TEXT,
    "riskFactorGroupDataId" TEXT NOT NULL,

    CONSTRAINT "RiskFactorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCompany" (
    "roles" TEXT[],
    "permissions" TEXT[],
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',
    "userId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCompany_pkey" PRIMARY KEY ("companyId","userId")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE',

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id","companyId")
);

-- CreateTable
CREATE TABLE "_primary_activity" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_secondary_activity" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EpiToRiskFactorData" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GenerateSourceToRiskFactorData" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_HierarchyToHomogeneousGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_recs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_engs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_adms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_code_key" ON "Activity"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Address_workspaceId_companyId_key" ON "Address"("workspaceId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_id_companyId_key" ON "Address"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_companyId_key" ON "Address"("companyId");

-- CreateIndex
CREATE INDEX "Epi_ca_idx" ON "Epi"("ca");

-- CreateIndex
CREATE UNIQUE INDEX "Epi_ca_status_key" ON "Epi"("ca", "status");

-- CreateIndex
CREATE UNIQUE INDEX "GenerateSource_id_companyId_key" ON "GenerateSource"("id", "companyId");

-- CreateIndex
CREATE INDEX "Hierarchy_companyId_idx" ON "Hierarchy"("companyId");

-- CreateIndex
CREATE INDEX "HomogeneousGroup_companyId_idx" ON "HomogeneousGroup"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "License_companyId_key" ON "License"("companyId");

-- CreateIndex
CREATE INDEX "License_companyId_idx" ON "License"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "RecMed_id_companyId_key" ON "RecMed"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorGroupData_id_companyId_key" ON "RiskFactorGroupData"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorData_id_companyId_key" ON "RiskFactorData"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_primary_activity_AB_unique" ON "_primary_activity"("A", "B");

-- CreateIndex
CREATE INDEX "_primary_activity_B_index" ON "_primary_activity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_secondary_activity_AB_unique" ON "_secondary_activity"("A", "B");

-- CreateIndex
CREATE INDEX "_secondary_activity_B_index" ON "_secondary_activity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EpiToRiskFactorData_AB_unique" ON "_EpiToRiskFactorData"("A", "B");

-- CreateIndex
CREATE INDEX "_EpiToRiskFactorData_B_index" ON "_EpiToRiskFactorData"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenerateSourceToRiskFactorData_AB_unique" ON "_GenerateSourceToRiskFactorData"("A", "B");

-- CreateIndex
CREATE INDEX "_GenerateSourceToRiskFactorData_B_index" ON "_GenerateSourceToRiskFactorData"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HierarchyToHomogeneousGroup_AB_unique" ON "_HierarchyToHomogeneousGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_HierarchyToHomogeneousGroup_B_index" ON "_HierarchyToHomogeneousGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_recs_AB_unique" ON "_recs"("A", "B");

-- CreateIndex
CREATE INDEX "_recs_B_index" ON "_recs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_engs_AB_unique" ON "_engs"("A", "B");

-- CreateIndex
CREATE INDEX "_engs_B_index" ON "_engs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_adms_AB_unique" ON "_adms"("A", "B");

-- CreateIndex
CREATE INDEX "_adms_B_index" ON "_adms"("B");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_id_companyId_fkey" FOREIGN KEY ("id", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistData" ADD CONSTRAINT "ChecklistData_checklistId_companyId_fkey" FOREIGN KEY ("checklistId", "companyId") REFERENCES "Checklist"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_receivingServiceCompanyId_fkey" FOREIGN KEY ("receivingServiceCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_applyingServiceCompanyId_fkey" FOREIGN KEY ("applyingServiceCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatabaseTable" ADD CONSTRAINT "DatabaseTable_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_workplaceId_companyId_fkey" FOREIGN KEY ("workplaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateSource" ADD CONSTRAINT "GenerateSource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerateSource" ADD CONSTRAINT "GenerateSource_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_workplaceId_companyId_fkey" FOREIGN KEY ("workplaceId", "companyId") REFERENCES "Workspace"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hierarchy" ADD CONSTRAINT "Hierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomogeneousGroup" ADD CONSTRAINT "HomogeneousGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecMed" ADD CONSTRAINT "RecMed_generateSourceId_companyId_fkey" FOREIGN KEY ("generateSourceId", "companyId") REFERENCES "GenerateSource"("id", "companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactors" ADD CONSTRAINT "RiskFactors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorGroupData" ADD CONSTRAINT "RiskFactorGroupData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_riskId_companyId_fkey" FOREIGN KEY ("riskId", "companyId") REFERENCES "RiskFactors"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_homogeneousGroupId_fkey" FOREIGN KEY ("homogeneousGroupId") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactorData" ADD CONSTRAINT "RiskFactorData_riskFactorGroupDataId_fkey" FOREIGN KEY ("riskFactorGroupDataId") REFERENCES "RiskFactorGroupData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_primary_activity" ADD FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_primary_activity" ADD FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondary_activity" ADD FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondary_activity" ADD FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpiToRiskFactorData" ADD FOREIGN KEY ("A") REFERENCES "Epi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpiToRiskFactorData" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenerateSourceToRiskFactorData" ADD FOREIGN KEY ("A") REFERENCES "GenerateSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenerateSourceToRiskFactorData" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HierarchyToHomogeneousGroup" ADD FOREIGN KEY ("A") REFERENCES "Hierarchy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HierarchyToHomogeneousGroup" ADD FOREIGN KEY ("B") REFERENCES "HomogeneousGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recs" ADD FOREIGN KEY ("A") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recs" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_engs" ADD FOREIGN KEY ("A") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_engs" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adms" ADD FOREIGN KEY ("A") REFERENCES "RecMed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adms" ADD FOREIGN KEY ("B") REFERENCES "RiskFactorData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
