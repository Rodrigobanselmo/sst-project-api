-- CreateEnum
CREATE TYPE "RiskSubTypeEnum" AS ENUM ('PSYCHOSOCIAL');

-- CreateEnum
CREATE TYPE "FormCOPSOQLevelEnum" AS ENUM ('SHORT', 'MED', 'LONG');

-- CreateEnum
CREATE TYPE "FormQuestionTypeEnum" AS ENUM ('TEXT', 'RADIO', 'CHECKBOX', 'DATE', 'NUMBER', 'SELECT', 'SHORT_TEXT', 'LONG_TEXT', 'FREQUENCY', 'INTENSITY');

-- CreateEnum
CREATE TYPE "FormIdentifierTypeEnum" AS ENUM ('EMAIL', 'CPF', 'AGE', 'SEX', 'WORKSPACE', 'DIRECTORY', 'MANAGEMENT', 'SECTOR', 'SUB_SECTOR', 'OFFICE', 'SUB_OFFICE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FormTypeEnum" AS ENUM ('NORMAL', 'PSYCHOSOCIAL', 'RISK');

-- CreateEnum
CREATE TYPE "FormCOPSOQCategoryEnum" AS ENUM ('COMPORTAMENTOS_OFENSIVOS', 'EXIGENCIAS_LABORAIS', 'INTERFACE_TRABALHO_INDIVIDUO', 'ORGANIZACAO_DO_TRABALHO_E_CONTEUDO', 'PERSONALIDADE', 'RELACOES_SOCIAIS_E_LIDERANCA', 'SAUDE_E_BEM_ESTAR', 'VALORES_NO_LOCAL_DE_TRABALHO');

-- CreateEnum
CREATE TYPE "FormCOPSOQDimensionEnum" AS ENUM ('COMPORTAMENTOS_OFENSIVOS', 'AMEACAS_DE_VIOLENCIA', 'ASSEDIO_SEXUAL', 'ASSEDIO_VIRTUAL', 'ATOS_NEGATIVOS', 'BULLYING', 'CONFLITOS_E_DESENTENDIMENTOS', 'VIOLENCIA_FISICA', 'EXIGENCIAS_QUANTITATIVAS', 'RITMO_DE_TRABALHO', 'DEMANDAS_COGNITIVAS', 'DEMANDAS_EMOCIONAIS', 'DEMANDAS_PARA_ESCONDER_EMOCOES', 'SATISFACAO_NO_TRABALHO', 'INSEGURANCA_NO_TRABALHO', 'CONFLITO_TRABALHO_FAMILIA', 'INSEGURANCA_SOBRE_CONDICOES_DE_TRABALHO', 'QUALIDADE_DO_TRABALHO', 'CONTROLE_SOBRE_O_TEMPO_DE_TRABALHO', 'INFLUENCIA_NO_TRABALHO', 'POSSIBILIDADES_DE_DESENVOLVIMENTO', 'SIGNIFICADO_DO_TRABALHO', 'ENGAJAMENTO_NO_TRABALHO', 'COMPROMISSO_FACE_AO_LOCAL_DE_TRABALHO', 'VARIEDADE_DE_TRABALHO', 'AUTOEFICACIA', 'PREVISIBILIDADE', 'TRANSPARENCIA_DE_PAPEL', 'RECOMPENSAS', 'CONFLITOS_LABORAIS', 'TAREFAS_ILEGITIMAS', 'APOIO_SOCIAL_DE_COLEGAS', 'APOIO_SOCIAL_DE_SUPERIORES', 'QUALIDADE_DA_CHEFIA', 'SAUDE_GERAL', 'PROBLEMAS_EM_DORMIR', 'BURNOUT', 'ESTRESSE', 'SINTOMAS_DEPRESSIVOS', 'ESTRESSE_COGNITIVO', 'ESTRESSE_SOMATICO', 'SENTIDO_DE_COMUNIDADE_SOCIAL_NO_TRABALHO', 'CONFIANCA_HORIZONTAL', 'CONFIANCA_VERTICAL', 'JUSTICA_E_RESPEITO_ORGANIZACIONAL');

-- AlterTable
ALTER TABLE "RiskFactors" ADD COLUMN     "sub_type" "RiskSubTypeEnum"[];

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FormTypeEnum" NOT NULL DEFAULT 'NORMAL',
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "shareable_link" BOOLEAN NOT NULL DEFAULT false,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "StatusEnum" NOT NULL DEFAULT 'PENDING',
    "shareable_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,
    "form_id" INTEGER NOT NULL,
    "identifier_group_id" INTEGER NOT NULL,

    CONSTRAINT "FormApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormParticipants" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "form_application_id" TEXT NOT NULL,

    CONSTRAINT "FormParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormParticipantsWorkspace" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "form_participants_id" INTEGER NOT NULL,

    CONSTRAINT "FormParticipantsWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormParticipantsHierarchy" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "hierarchyId" TEXT NOT NULL,
    "form_participants_id" INTEGER NOT NULL,

    CONSTRAINT "FormParticipantsHierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionIdentifierGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormQuestionIdentifierGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "form_id" INTEGER NOT NULL,

    CONSTRAINT "FormQuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormParticipantsAnswers" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "form_application_id" TEXT NOT NULL,
    "employee_id" INTEGER,

    CONSTRAINT "FormParticipantsAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestion" (
    "id" SERIAL NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "question_id" INTEGER NOT NULL,
    "group_id" INTEGER,
    "identifier_group_id" INTEGER,

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormAnswer" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "value" TEXT,
    "option_id" INTEGER,
    "question_id" INTEGER NOT NULL,
    "participants_answers_id" INTEGER NOT NULL,

    CONSTRAINT "FormAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionData" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "type" "FormQuestionTypeEnum" NOT NULL,
    "accept_other" BOOLEAN NOT NULL DEFAULT false,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,
    "copsoq_id" INTEGER,
    "identifier_id" INTEGER,

    CONSTRAINT "FormQuestionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionOption" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "FormQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionRisk" (
    "id" SERIAL NOT NULL,
    "question_Id" INTEGER NOT NULL,
    "risk_id" TEXT NOT NULL,

    CONSTRAINT "FormQuestionRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionCOPSOQ" (
    "id" SERIAL NOT NULL,
    "dimension" "FormCOPSOQDimensionEnum" NOT NULL,
    "category" "FormCOPSOQCategoryEnum" NOT NULL,
    "item" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "level" "FormCOPSOQLevelEnum" NOT NULL,

    CONSTRAINT "FormQuestionCOPSOQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionIdentifier" (
    "id" SERIAL NOT NULL,
    "direct_association" BOOLEAN NOT NULL DEFAULT false,
    "type" "FormIdentifierTypeEnum" NOT NULL,

    CONSTRAINT "FormQuestionIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Form_type_idx" ON "Form"("type");

-- CreateIndex
CREATE INDEX "Form_company_id_idx" ON "Form"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "Form_id_company_id_key" ON "Form"("id", "company_id");

-- CreateIndex
CREATE INDEX "FormApplication_company_id_idx" ON "FormApplication"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormApplication_id_company_id_key" ON "FormApplication"("id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormParticipants_form_application_id_key" ON "FormParticipants"("form_application_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormQuestionOption_order_question_id_key" ON "FormQuestionOption"("order", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "FormQuestionCOPSOQ_item_key" ON "FormQuestionCOPSOQ"("item");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_identifier_group_id_fkey" FOREIGN KEY ("identifier_group_id") REFERENCES "FormQuestionIdentifierGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipants" ADD CONSTRAINT "FormParticipants_form_application_id_fkey" FOREIGN KEY ("form_application_id") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsWorkspace" ADD CONSTRAINT "FormParticipantsWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsWorkspace" ADD CONSTRAINT "FormParticipantsWorkspace_form_participants_id_fkey" FOREIGN KEY ("form_participants_id") REFERENCES "FormParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsHierarchy" ADD CONSTRAINT "FormParticipantsHierarchy_hierarchyId_fkey" FOREIGN KEY ("hierarchyId") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsHierarchy" ADD CONSTRAINT "FormParticipantsHierarchy_form_participants_id_fkey" FOREIGN KEY ("form_participants_id") REFERENCES "FormParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionGroup" ADD CONSTRAINT "FormQuestionGroup_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsAnswers" ADD CONSTRAINT "FormParticipantsAnswers_form_application_id_fkey" FOREIGN KEY ("form_application_id") REFERENCES "FormApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsAnswers" ADD CONSTRAINT "FormParticipantsAnswers_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "FormQuestionData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "FormQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_identifier_group_id_fkey" FOREIGN KEY ("identifier_group_id") REFERENCES "FormQuestionIdentifierGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "FormQuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "FormQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_participants_answers_id_fkey" FOREIGN KEY ("participants_answers_id") REFERENCES "FormParticipantsAnswers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_copsoq_id_fkey" FOREIGN KEY ("copsoq_id") REFERENCES "FormQuestionCOPSOQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_identifier_id_fkey" FOREIGN KEY ("identifier_id") REFERENCES "FormQuestionIdentifier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionOption" ADD CONSTRAINT "FormQuestionOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "FormQuestionData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionRisk" ADD CONSTRAINT "FormQuestionRisk_question_Id_fkey" FOREIGN KEY ("question_Id") REFERENCES "FormQuestionData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionRisk" ADD CONSTRAINT "FormQuestionRisk_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "RiskFactors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
