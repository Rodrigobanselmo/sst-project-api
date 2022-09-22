-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "json" JSONB NOT NULL,
    "repeatId" TEXT,
    "isClinic" BOOLEAN,
    "isConsulting" BOOLEAN,
    "isCompany" BOOLEAN,
    "system" BOOLEAN,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToNotification" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_NotificationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_user_notification_confirm" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Notification_system_idx" ON "Notification"("system");

-- CreateIndex
CREATE INDEX "Notification_isCompany_idx" ON "Notification"("isCompany");

-- CreateIndex
CREATE INDEX "Notification_isConsulting_idx" ON "Notification"("isConsulting");

-- CreateIndex
CREATE INDEX "Notification_companyId_idx" ON "Notification"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToNotification_AB_unique" ON "_CompanyToNotification"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToNotification_B_index" ON "_CompanyToNotification"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_NotificationToUser_AB_unique" ON "_NotificationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_NotificationToUser_B_index" ON "_NotificationToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user_notification_confirm_AB_unique" ON "_user_notification_confirm"("A", "B");

-- CreateIndex
CREATE INDEX "_user_notification_confirm_B_index" ON "_user_notification_confirm"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToNotification" ADD CONSTRAINT "_CompanyToNotification_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToNotification" ADD CONSTRAINT "_CompanyToNotification_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_notification_confirm" ADD CONSTRAINT "_user_notification_confirm_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_notification_confirm" ADD CONSTRAINT "_user_notification_confirm_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
