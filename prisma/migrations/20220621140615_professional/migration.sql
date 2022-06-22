/*
  Warnings:

  - You are about to drop the column `responsableName` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "responsableName",
ADD COLUMN     "responsibleName" TEXT;

-- CreateTable
CREATE TABLE "Proffesional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Proffesional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proffesional_name_userId_key" ON "Proffesional"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Proffesional_userId_name_key" ON "Proffesional"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_name_key" ON "User"("id", "name");

-- AddForeignKey
ALTER TABLE "Proffesional" ADD CONSTRAINT "Proffesional_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proffesional" ADD CONSTRAINT "Proffesional_userId_name_fkey" FOREIGN KEY ("userId", "name") REFERENCES "User"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;
