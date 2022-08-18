/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `DocumentCover` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `DocumentCover` table. All the data in the column will be lost.
  - Added the required column `json` to the `DocumentCover` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentCover" DROP COLUMN "coverUrl",
DROP COLUMN "description",
ADD COLUMN     "json" JSONB NOT NULL;
