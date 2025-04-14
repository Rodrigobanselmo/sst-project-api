/*
  Warnings:

  - You are about to drop the column `identifier_group_id` on the `FormApplication` table. All the data in the column will be lost.
  - You are about to drop the column `shareable_link` on the `FormApplication` table. All the data in the column will be lost.
  - You are about to drop the column `hierarchyId` on the `FormParticipantsHierarchy` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `FormParticipantsWorkspace` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `identifier_group_id` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `FormQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `copsoq_id` on the `FormQuestionData` table. All the data in the column will be lost.
  - You are about to drop the column `identifier_id` on the `FormQuestionData` table. All the data in the column will be lost.
  - Added the required column `hierarchy_id` to the `FormParticipantsHierarchy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspace_id` to the `FormParticipantsWorkspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_data_id` to the `FormQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FormQuestionCOPSOQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FormQuestionIdentifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FormQuestionOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormApplication" DROP CONSTRAINT "FormApplication_identifier_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormParticipantsHierarchy" DROP CONSTRAINT "FormParticipantsHierarchy_hierarchyId_fkey";

-- DropForeignKey
ALTER TABLE "FormParticipantsWorkspace" DROP CONSTRAINT "FormParticipantsWorkspace_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_identifier_group_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_question_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_copsoq_id_fkey";

-- DropForeignKey
ALTER TABLE "FormQuestionData" DROP CONSTRAINT "FormQuestionData_identifier_id_fkey";

-- AlterTable
ALTER TABLE "FormApplication" DROP COLUMN "identifier_group_id",
DROP COLUMN "shareable_link",
ADD COLUMN     "question_identifier_group_id" INTEGER;

-- AlterTable
ALTER TABLE "FormParticipantsHierarchy" DROP COLUMN "hierarchyId",
ADD COLUMN     "hierarchy_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FormParticipantsWorkspace" DROP COLUMN "workspaceId",
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FormQuestion" DROP COLUMN "group_id",
DROP COLUMN "identifier_group_id",
DROP COLUMN "question_id",
ADD COLUMN     "question_data_id" INTEGER NOT NULL,
ADD COLUMN     "question_group_id" INTEGER,
ADD COLUMN     "question_identifier_group_id" INTEGER;

-- AlterTable
ALTER TABLE "FormQuestionCOPSOQ" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FormQuestionData" DROP COLUMN "copsoq_id",
DROP COLUMN "identifier_id",
ADD COLUMN     "question_copsoq_id" INTEGER,
ADD COLUMN     "question_identifier_id" INTEGER;

-- AlterTable
ALTER TABLE "FormQuestionIdentifier" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "system" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FormQuestionOption" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "FormApplication" ADD CONSTRAINT "FormApplication_question_identifier_group_id_fkey" FOREIGN KEY ("question_identifier_group_id") REFERENCES "FormQuestionIdentifierGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsWorkspace" ADD CONSTRAINT "FormParticipantsWorkspace_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormParticipantsHierarchy" ADD CONSTRAINT "FormParticipantsHierarchy_hierarchy_id_fkey" FOREIGN KEY ("hierarchy_id") REFERENCES "Hierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_data_id_fkey" FOREIGN KEY ("question_data_id") REFERENCES "FormQuestionData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_group_id_fkey" FOREIGN KEY ("question_group_id") REFERENCES "FormQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_question_identifier_group_id_fkey" FOREIGN KEY ("question_identifier_group_id") REFERENCES "FormQuestionIdentifierGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_question_copsoq_id_fkey" FOREIGN KEY ("question_copsoq_id") REFERENCES "FormQuestionCOPSOQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestionData" ADD CONSTRAINT "FormQuestionData_question_identifier_id_fkey" FOREIGN KEY ("question_identifier_id") REFERENCES "FormQuestionIdentifier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
