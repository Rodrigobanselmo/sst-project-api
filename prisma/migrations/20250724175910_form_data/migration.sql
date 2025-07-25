/*
  Warnings:

  - You are about to drop the column `order` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question_data_id` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `required` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `accept_other` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `question_copsoq_id` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `question_identifier_id` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `system` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `FormQuestionGroup` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `FormQuestionGroup` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `FormQuestionGroup` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `FormQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `FormQuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `FormQuestionOption` table. All the data in the column will be lost.
  - Added the required column `question_details_id` to the `FormQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_question_id` to the `FormQuestionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `FormQuestionData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_question_data_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_company_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_question_copsoq_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_question_identifier_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionOption" DROP CONSTRAINT "FormQuestionOption_question_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionRisk" DROP CONSTRAINT "FormQuestionRisk_question_Id_fkey";

-- DropIndex
DROP INDEX "FormQuestionOption_order_question_id_key";

-- AlterTable
ALTER TABLE "FormQuestion" DROP COLUMN "order",
DROP COLUMN "question_data_id",
DROP COLUMN "required",
ADD COLUMN     "question_details_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormQuestionData" DROP COLUMN "accept_other",
DROP COLUMN "company_id",
DROP COLUMN "question_copsoq_id",
DROP COLUMN "question_identifier_id",
DROP COLUMN "system",
DROP COLUMN "text",
DROP COLUMN "type",
ADD COLUMN     "form_question_id" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FormQuestionGroup" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "FormQuestionOption" DROP COLUMN "order",
DROP COLUMN "text",
DROP COLUMN "value";

-- CreateTable
CREATE TABLE "FormQuestionGroupData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "form_question_group_id" INTEGER NOT NULL,

    CONSTRAINT "FormQuestionGroupData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionDetails" (
    "id" SERIAL NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,
    "question_copsoq_id" INTEGER,
    "question_identifier_id" INTEGER,

    CONSTRAINT "FormQuestionDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionDetailsData" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "type" "FormQuestionTypeEnum" NOT NULL,
    "accept_other" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "form_question_details_id" INTEGER NOT NULL,

    CONSTRAINT "FormQuestionDetailsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestionOptionData" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "value" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "form_question_option_id" INTEGER NOT NULL,

    CONSTRAINT "FormQuestionOptionData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormQuestionGroupData" ADD CONSTRAINT "FormQuestionGroupData_form_question_group_id_fkey" FOREIGN KEY ("form_question_group_id") REFERENCES "FormQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_details_id_fkey" FOREIGN KEY ("question_details_id") REFERENCES "FormQuestionDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_form_question_id_fkey" FOREIGN KEY ("form_question_id") REFERENCES "FormQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionDetails" ADD CONSTRAINT "FormQuestionDetails_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
