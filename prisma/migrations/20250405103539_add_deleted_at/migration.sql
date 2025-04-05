/*
  Warnings:

  - You are about to drop the column `sequential_id` on the `_recs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SystemFile" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "_recs" DROP COLUMN "sequential_id";
