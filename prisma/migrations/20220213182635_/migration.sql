/*
  Warnings:

  - The `status` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Contract` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `License` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `UserCompany` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Workspace` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('ACTIVE', 'PROGRESS', 'INACTIVE', 'PENDING', 'CANCELED');

-- AlterTable
ALTER TABLE "Checklist" ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'PROGRESS';

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "License" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "UserCompany" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "status",
ADD COLUMN     "status" "StatusEnum" NOT NULL DEFAULT E'ACTIVE';
