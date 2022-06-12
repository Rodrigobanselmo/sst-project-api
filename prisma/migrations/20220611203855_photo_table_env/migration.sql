/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `CompanyEnvironment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyEnvironment" DROP COLUMN "photoUrl";

-- CreateTable
CREATE TABLE "CompanyEnvironmentPhoto" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "companyEnvironmentId" TEXT NOT NULL,

    CONSTRAINT "CompanyEnvironmentPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyEnvironmentPhoto" ADD CONSTRAINT "CompanyEnvironmentPhoto_companyEnvironmentId_fkey" FOREIGN KEY ("companyEnvironmentId") REFERENCES "CompanyEnvironment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
