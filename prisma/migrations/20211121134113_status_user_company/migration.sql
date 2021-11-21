-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "status" SET DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "status" SET DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "UserCompany" ADD COLUMN     "status" TEXT NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "status" SET DEFAULT E'ACTIVE';
