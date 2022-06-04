-- AddForeignKey
ALTER TABLE "InviteUsers" ADD CONSTRAINT "InviteUsers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
