/*
  Warnings:

  - You are about to drop the column `question_identifier_group_id` on the `FormApplication` table. All the data in the column will be lost.
  - You are about to drop the column `question_identifier_group_id` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question_copsoq_id` on the `FormQuestionDetails` table. All the data in the column will be lost.
  - You are about to drop the column `question_identifier_id` on the `FormQuestionDetails` table. All the data in the column will be lost.
  - You are about to drop the `FormQuestionIdentifierGroup` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `question_group_id` on table `FormQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FormApplication" DROP CONSTRAINT "FormApplication_question_identifier_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_question_identifier_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionDetails" DROP CONSTRAINT "FormQuestionDetails_question_copsoq_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionDetails" DROP CONSTRAINT "FormQuestionDetails_question_identifier_id_fkey";

-- AlterTable
ALTER TABLE "FormApplication" DROP COLUMN "question_identifier_group_id";

-- AlterTable
ALTER TABLE "FormQuestion" DROP COLUMN "question_identifier_group_id",
ALTER COLUMN "question_group_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "FormQuestionDetails" DROP COLUMN "question_copsoq_id",
DROP COLUMN "question_identifier_id";

-- AlterTable
ALTER TABLE "FormQuestionDetailsData" ADD COLUMN     "question_copsoq_id" TEXT,
ADD COLUMN     "question_identifier_id" TEXT;

-- AlterTable
ALTER TABLE "FormQuestionGroup" ADD COLUMN     "form_application_id" TEXT,
ALTER COLUMN "form_id" DROP NOT NULL;

-- DropTable
DROP TABLE "FormQuestionIdentifierGroup";

-- AddForeignKey
ALTER TABLE "FormQuestionGroup" ADD CONSTRAINT "FormQuestionGroup_form_application_id_fkey" FOREIGN KEY ("form_application_id") REFERENCES "FormApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionDetailsData" ADD CONSTRAINT "FormQuestionDetailsData_question_copsoq_id_fkey" FOREIGN KEY ("question_copsoq_id") REFERENCES "FormQuestionCOPSOQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionDetailsData" ADD CONSTRAINT "FormQuestionDetailsData_question_identifier_id_fkey" FOREIGN KEY ("question_identifier_id") REFERENCES "FormQuestionIdentifier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
