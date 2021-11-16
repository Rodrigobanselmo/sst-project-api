-- CreateTable
CREATE TABLE "InviteToken" (
    "id" TEXT NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("id")
);
