/*
  Warnings:

  - You are about to drop the `InviteToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "InviteToken";

-- CreateTable
CREATE TABLE "InviteUsers" (
    "id" TEXT NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "roles" TEXT[],
    "permissions" TEXT[],

    CONSTRAINT "InviteUsers_pkey" PRIMARY KEY ("id")
);
