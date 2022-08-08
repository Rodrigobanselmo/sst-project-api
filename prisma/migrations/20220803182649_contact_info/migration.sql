-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "activityStartDate" TIMESTAMP(3),
ADD COLUMN     "obs" TEXT;

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "phone_1" TEXT,
    "email" TEXT,
    "obs" TEXT,
    "companyId" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_id_companyId_key" ON "Contact"("id", "companyId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
