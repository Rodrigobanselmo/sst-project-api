-- CreateEnum
CREATE TYPE "ImagesTypeEnum" AS ENUM ('PGR', 'PCMSO', 'OTHERS', 'DOCS', 'CHAR', 'ENV', 'WORK', 'EQUI', 'ACTIV', 'COMPANY');

-- CreateTable
CREATE TABLE "ImageGallery" (
    "id" SERIAL NOT NULL,
    "types" "ImagesTypeEnum"[],
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageGallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageGallery_companyId_id_key" ON "ImageGallery"("companyId", "id");

-- AddForeignKey
ALTER TABLE "ImageGallery" ADD CONSTRAINT "ImageGallery_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
