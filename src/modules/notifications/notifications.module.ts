import { forwardRef, Module } from '@nestjs/common';
import { SendGridProvider } from '../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';

import { ChecklistModule } from '../sst/checklist.module';
import { CompanyModule } from '../company/company.module';
import { NotificationController } from './controller/notification.controller';
import { NotificationRepository } from './repositories/implementations/NotificationRepository';
import { CreateNotificationService } from './services/create-notification.service';
import { ListCompanyNotificationService } from './services/list-company-notification.service';
import { ListNotificationService } from './services/list-notification.service';
import { SendEmailService } from './services/send-email.service';
import { UpdateUserNotificationService } from './services/update-user-notification.service';

@Module({
  controllers: [NotificationController],
  imports: [forwardRef(() => CompanyModule), forwardRef(() => ChecklistModule)],
  exports: [NotificationRepository],
  providers: [
    SendEmailService,
    SendGridProvider,
    NotificationRepository,
    CreateNotificationService,
    ListNotificationService,
    ListCompanyNotificationService,
    UpdateUserNotificationService,
  ],
})
export class NotificationModule {}
