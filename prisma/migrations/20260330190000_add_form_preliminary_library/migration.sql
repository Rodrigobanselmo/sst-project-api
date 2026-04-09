-- CreateEnum
CREATE TYPE "FormPreliminaryLibraryQuestionTypeEnum" AS ENUM ('SINGLE_CHOICE', 'TEXT');

-- CreateEnum
CREATE TYPE "FormPreliminaryLibraryCategoryEnum" AS ENUM ('DEMOGRAPHIC', 'ORGANIZATIONAL', 'SEGMENTATION', 'OTHER');

-- CreateTable
CREATE TABLE "form_preliminary_library_question" (
    "id" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "company_id" TEXT,
    "name" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" "FormPreliminaryLibraryQuestionTypeEnum" NOT NULL,
    "category" "FormPreliminaryLibraryCategoryEnum" NOT NULL,
    "identifier_type" "FormIdentifierTypeEnum" NOT NULL,
    "accept_other" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "form_preliminary_library_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_preliminary_library_question_option" (
    "id" TEXT NOT NULL,
    "library_question_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "value" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "form_preliminary_library_question_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_preliminary_library_block" (
    "id" TEXT NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "company_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "form_preliminary_library_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_preliminary_library_block_item" (
    "id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "library_question_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "form_preliminary_library_block_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_preliminary_library_question_company_id_idx" ON "form_preliminary_library_question"("company_id");

-- CreateIndex
CREATE INDEX "form_preliminary_library_question_system_idx" ON "form_preliminary_library_question"("system");

-- CreateIndex
CREATE INDEX "form_preliminary_library_question_category_idx" ON "form_preliminary_library_question"("category");

-- CreateIndex
CREATE INDEX "form_preliminary_library_question_option_library_question_id_idx" ON "form_preliminary_library_question_option"("library_question_id");

-- CreateIndex
CREATE INDEX "form_preliminary_library_block_company_id_idx" ON "form_preliminary_library_block"("company_id");

-- CreateIndex
CREATE INDEX "form_preliminary_library_block_system_idx" ON "form_preliminary_library_block"("system");

-- CreateIndex
CREATE INDEX "form_preliminary_library_block_item_block_id_idx" ON "form_preliminary_library_block_item"("block_id");

-- CreateIndex
CREATE UNIQUE INDEX "form_preliminary_library_block_item_block_id_library_question_id_key" ON "form_preliminary_library_block_item"("block_id", "library_question_id");

-- AddForeignKey
ALTER TABLE "form_preliminary_library_question" ADD CONSTRAINT "form_preliminary_library_question_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_preliminary_library_question_option" ADD CONSTRAINT "form_preliminary_library_question_option_library_question_id_fkey" FOREIGN KEY ("library_question_id") REFERENCES "form_preliminary_library_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_preliminary_library_block" ADD CONSTRAINT "form_preliminary_library_block_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_preliminary_library_block_item" ADD CONSTRAINT "form_preliminary_library_block_item_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "form_preliminary_library_block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_preliminary_library_block_item" ADD CONSTRAINT "form_preliminary_library_block_item_library_question_id_fkey" FOREIGN KEY ("library_question_id") REFERENCES "form_preliminary_library_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
