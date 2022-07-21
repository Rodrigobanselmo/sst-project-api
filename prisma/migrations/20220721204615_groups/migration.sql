-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "groupId" INTEGER;

-- CreateTable
CREATE TABLE "CompanyGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessGroups" (
    "id" SERIAL NOT NULL,
    "roles" TEXT[],
    "permissions" TEXT[],

    CONSTRAINT "AccessGroups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CompanyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
