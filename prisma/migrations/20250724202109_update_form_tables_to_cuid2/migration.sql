/*
  Warnings:

  - The primary key for the `Form` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormAnswer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormParticipantsAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormParticipantsHierarchy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormParticipantsWorkspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionCOPSOQ` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionDetailsData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionGroupData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionIdentifier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionIdentifierGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionOptionData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FormQuestionRisk` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_option_id_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_participants_answers_id_fkey";

-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_question_id_fkey";

-- DropForeignKey
ALTER TABLE "FormApplication" DROP CONSTRAINT "FormApplication_form_id_fkey";

-- DropForeignKey
ALTER TABLE "FormApplication" DROP CONSTRAINT "FormApplication_question_identifier_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormParticipantsHierarchy" DROP CONSTRAINT "FormParticipantsHierarchy_form_participants_id_fkey";

-- DropForeignKey
ALTER TABLE "FormParticipantsWorkspace" DROP CONSTRAINT "FormParticipantsWorkspace_form_participants_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_question_details_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_question_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_question_identifier_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_form_question_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionDetails" DROP CONSTRAINT "FormQuestionDetails_question_copsoq_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionDetails" DROP CONSTRAINT "FormQuestionDetails_question_identifier_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionDetailsData" DROP CONSTRAINT "FormQuestionDetailsData_form_question_details_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionGroup" DROP CONSTRAINT "FormQuestionGroup_form_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionGroupData" DROP CONSTRAINT "FormQuestionGroupData_form_question_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionOption" DROP CONSTRAINT "FormQuestionOption_question_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionOptionData" DROP CONSTRAINT "FormQuestionOptionData_form_question_option_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionRisk" DROP CONSTRAINT "FormQuestionRisk_question_Id_fkey";

-- AlterTable
ALTER TABLE "Form" DROP CONSTRAINT "Form_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Form_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Form_id_seq";

-- AlterTable
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "option_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ALTER COLUMN "participants_answers_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormAnswer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormAnswer_id_seq";

-- AlterTable
ALTER TABLE "FormApplication" ALTER COLUMN "form_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_identifier_group_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FormParticipants" DROP CONSTRAINT "FormParticipants_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormParticipants_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormParticipants_id_seq";

-- AlterTable
ALTER TABLE "FormParticipantsAnswers" DROP CONSTRAINT "FormParticipantsAnswers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormParticipantsAnswers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormParticipantsAnswers_id_seq";

-- AlterTable
ALTER TABLE "FormParticipantsHierarchy" DROP CONSTRAINT "FormParticipantsHierarchy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_participants_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormParticipantsHierarchy_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormParticipantsHierarchy_id_seq";

-- AlterTable
ALTER TABLE "FormParticipantsWorkspace" DROP CONSTRAINT "FormParticipantsWorkspace_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_participants_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormParticipantsWorkspace_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormParticipantsWorkspace_id_seq";

-- AlterTable
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "question_group_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_identifier_group_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_details_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestion_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionCOPSOQ" DROP CONSTRAINT "FormQuestionCOPSOQ_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionCOPSOQ_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionCOPSOQ_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_question_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionData_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionData_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionDetails" DROP CONSTRAINT "FormQuestionDetails_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "question_copsoq_id" SET DATA TYPE TEXT,
ALTER COLUMN "question_identifier_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionDetails_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionDetails_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionDetailsData" DROP CONSTRAINT "FormQuestionDetailsData_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_question_details_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionDetailsData_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionDetailsData_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionGroup" DROP CONSTRAINT "FormQuestionGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionGroup_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionGroupData" DROP CONSTRAINT "FormQuestionGroupData_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_question_group_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionGroupData_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionGroupData_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionIdentifier" DROP CONSTRAINT "FormQuestionIdentifier_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionIdentifier_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionIdentifier_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionIdentifierGroup" DROP CONSTRAINT "FormQuestionIdentifierGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionIdentifierGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionIdentifierGroup_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionOption" DROP CONSTRAINT "FormQuestionOption_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionOption_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionOption_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionOptionData" DROP CONSTRAINT "FormQuestionOptionData_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_question_option_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionOptionData_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionOptionData_id_seq";

-- AlterTable
ALTER TABLE "FormQuestionRisk" DROP CONSTRAINT "FormQuestionRisk_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "question_Id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FormQuestionRisk_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FormQuestionRisk_id_seq";

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_question_identifier_group_id_fkey" FOREIGN KEY ("question_identifier_group_id") REFERENCES "FormQuestionIdentifierGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsWorkspace" ADD CONSTRAINT "FormParticipantsWorkspace_form_participants_id_fkey" FOREIGN KEY ("form_participants_id") REFERENCES "FormParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsHierarchy" ADD CONSTRAINT "FormParticipantsHierarchy_form_participants_id_fkey" FOREIGN KEY ("form_participants_id") REFERENCES "FormParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionGroup" ADD CONSTRAINT "FormQuestionGroup_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionGroupData" ADD CONSTRAINT "FormQuestionGroupData_form_question_group_id_fkey" FOREIGN KEY ("form_question_group_id") REFERENCES "FormQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_details_id_fkey" FOREIGN KEY ("question_details_id") REFERENCES "FormQuestionDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_group_id_fkey" FOREIGN KEY ("question_group_id") REFERENCES "FormQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_identifier_group_id_fkey" FOREIGN KEY ("question_identifier_group_id") REFERENCES "FormQuestionIdentifierGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_form_question_id_fkey" FOREIGN KEY ("form_question_id") REFERENCES "FormQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "FormQuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "FormQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_participants_answers_id_fkey" FOREIGN KEY ("participants_answers_id") REFERENCES "FormParticipantsAnswers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionDetails" ADD CONSTRAINT "FormQuestionDetails_question_copsoq_id_fkey" FOREIGN KEY ("question_copsoq_id") REFERENCES "FormQuestionCOPSOQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionDetails" ADD CONSTRAINT "FormQuestionDetails_question_identifier_id_fkey" FOREIGN KEY ("question_identifier_id") REFERENCES "FormQuestionIdentifier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionDetailsData" ADD CONSTRAINT "FormQuestionDetailsData_form_question_details_id_fkey" FOREIGN KEY ("form_question_details_id") REFERENCES "FormQuestionDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionOption" ADD CONSTRAINT "FormQuestionOption_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "FormQuestionDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionOptionData" ADD CONSTRAINT "FormQuestionOptionData_form_question_option_id_fkey" FOREIGN KEY ("form_question_option_id") REFERENCES "FormQuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionRisk" ADD CONSTRAINT "FormQuestionRisk_question_Id_fkey" FOREIGN KEY ("question_Id") REFERENCES "FormQuestionDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
