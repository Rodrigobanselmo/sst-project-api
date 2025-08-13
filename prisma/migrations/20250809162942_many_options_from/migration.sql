/*
  Warnings:

  - You are about to drop the column `option_id` on the `FormAnswer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormAnswer" DROP CONSTRAINT "FormAnswer_option_id_fkey";

-- AlterTable
ALTER TABLE "FormAnswer" DROP COLUMN "option_id";

-- CreateTable
CREATE TABLE "FormAnswerOption" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "answer_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,

    CONSTRAINT "FormAnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormAnswerOption_answer_id_option_id_key" ON "FormAnswerOption"("answer_id", "option_id");

-- AddForeignKey
ALTER TABLE "FormAnswerOption" ADD CONSTRAINT "FormAnswerOption_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "FormAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswerOption" ADD CONSTRAINT "FormAnswerOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "FormQuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
