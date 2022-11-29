-- DropForeignKey
ALTER TABLE "Cities" DROP CONSTRAINT "Cities_ufCode_fkey";

-- AddForeignKey
ALTER TABLE "Cities" ADD CONSTRAINT "Cities_ufCode_fkey" FOREIGN KEY ("ufCode") REFERENCES "Uf"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
