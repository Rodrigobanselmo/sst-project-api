-- AlterTable
ALTER TABLE "Cid" ADD COLUMN     "class" TEXT,
ADD COLUMN     "kill" BOOLEAN,
ADD COLUMN     "sex" "SexTypeEnum";

-- CreateTable
CREATE TABLE "Absenteeism" (
    "id" SERIAL NOT NULL,
    "observation" TEXT,
    "sameAsBefore" BOOLEAN,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "traffic" INTEGER,
    "vacationStartDate" TIMESTAMP(3),
    "vacationEndDate" TIMESTAMP(3),
    "cnpjSind" TEXT,
    "infOnusRemun" INTEGER,
    "cnpjMandElet" TEXT,
    "origRetif" INTEGER,
    "tpProc" INTEGER,
    "nrProc" INTEGER,
    "motiveId" INTEGER,
    "esocial18Motive" INTEGER,
    "cidId" TEXT,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "Absenteeism_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsenteeismMotive" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "AbsenteeismMotive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cat" (
    "id" SERIAL NOT NULL,
    "dtAcid" TIMESTAMP(3) NOT NULL,
    "tpAcid" INTEGER NOT NULL,
    "hrAcid" TEXT,
    "hrsTrabAntesAcid" TEXT,
    "tpCat" INTEGER NOT NULL,
    "isIndCatObito" BOOLEAN,
    "dtObito" TIMESTAMP(3),
    "isIndComunPolicia" BOOLEAN,
    "codSitGeradora" TEXT NOT NULL,
    "iniciatCAT" INTEGER NOT NULL,
    "obsCAT" TEXT,
    "ultDiaTrab" TIMESTAMP(3),
    "houveAfast" BOOLEAN,
    "tpLocal" INTEGER NOT NULL,
    "dscLocal" TEXT NOT NULL,
    "tpLograd" TEXT,
    "dscLograd" TEXT NOT NULL,
    "nrLograd" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "codMunic" TEXT,
    "uf" TEXT,
    "pais" TEXT,
    "codPostal" TEXT,
    "ideLocalAcidTpInsc" INTEGER,
    "ideLocalAcidCnpj" TEXT,
    "codParteAting" TEXT NOT NULL,
    "lateralidade" INTEGER NOT NULL,
    "codAgntCausador" TEXT NOT NULL,
    "dtAtendimento" TIMESTAMP(3) NOT NULL,
    "hrAtendimento" TEXT NOT NULL,
    "isIndInternacao" BOOLEAN NOT NULL,
    "durTrat" INTEGER NOT NULL,
    "isIndAfast" BOOLEAN NOT NULL,
    "dscLesao" TEXT NOT NULL,
    "dscCompLesao" TEXT,
    "diagProvavel" TEXT,
    "codCID" TEXT NOT NULL,
    "observacao" TEXT,
    "nmEmit" TEXT NOT NULL,
    "ideOC" INTEGER NOT NULL,
    "nrOC" TEXT NOT NULL,
    "ufOC" TEXT,
    "nrRecCatOrig" TEXT,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "Cat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cities" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ufCode" TEXT,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "EsocialTable18Mot" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "EsocialTable18Mot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EsocialTable6Country" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EsocialTable6Country_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "EsocialTable13BodyPart" (
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "EsocialTable13BodyPart_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "EsocialTable14And15Acid" (
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "case" TEXT,
    "table" INTEGER NOT NULL,

    CONSTRAINT "EsocialTable14And15Acid_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "EsocialTable17Injury" (
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "EsocialTable17Injury_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "EsocialTable20Lograd" (
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "EsocialTable20Lograd_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Uf" (
    "code" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Uf_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "EsocialTable18Mot_code_key" ON "EsocialTable18Mot"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Uf_uf_key" ON "Uf"("uf");

-- AddForeignKey
ALTER TABLE "Absenteeism" ADD CONSTRAINT "Absenteeism_motiveId_fkey" FOREIGN KEY ("motiveId") REFERENCES "AbsenteeismMotive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absenteeism" ADD CONSTRAINT "Absenteeism_esocial18Motive_fkey" FOREIGN KEY ("esocial18Motive") REFERENCES "EsocialTable18Mot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absenteeism" ADD CONSTRAINT "Absenteeism_cidId_fkey" FOREIGN KEY ("cidId") REFERENCES "Cid"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absenteeism" ADD CONSTRAINT "Absenteeism_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_codSitGeradora_fkey" FOREIGN KEY ("codSitGeradora") REFERENCES "EsocialTable14And15Acid"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_tpLograd_fkey" FOREIGN KEY ("tpLograd") REFERENCES "EsocialTable20Lograd"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_codMunic_fkey" FOREIGN KEY ("codMunic") REFERENCES "Cities"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_uf_fkey" FOREIGN KEY ("uf") REFERENCES "Uf"("uf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_pais_fkey" FOREIGN KEY ("pais") REFERENCES "EsocialTable6Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_codParteAting_fkey" FOREIGN KEY ("codParteAting") REFERENCES "EsocialTable13BodyPart"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_codAgntCausador_fkey" FOREIGN KEY ("codAgntCausador") REFERENCES "EsocialTable14And15Acid"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_dscLesao_fkey" FOREIGN KEY ("dscLesao") REFERENCES "EsocialTable17Injury"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_codCID_fkey" FOREIGN KEY ("codCID") REFERENCES "Cid"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cat" ADD CONSTRAINT "Cat_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cities" ADD CONSTRAINT "Cities_ufCode_fkey" FOREIGN KEY ("ufCode") REFERENCES "Uf"("uf") ON DELETE RESTRICT ON UPDATE CASCADE;
