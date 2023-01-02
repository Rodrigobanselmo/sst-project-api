-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "cbo" TEXT;

-- CreateTable
CREATE TABLE "Cbo" (
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Cbo_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cbo_code_desc_key" ON "Cbo"("code", "desc");
