import { forwardRef, Module } from '@nestjs/common';
import { NodeMailProvider } from '../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';

import { SSTModule } from '../sst/sst.module';
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
  imports: [forwardRef(() => CompanyModule), forwardRef(() => SSTModule)],
  exports: [NotificationRepository],
  providers: [
    SendEmailService,
    NodeMailProvider,
    NotificationRepository,
    CreateNotificationService,
    ListNotificationService,
    ListCompanyNotificationService,
    UpdateUserNotificationService,
  ],
})
export class NotificationModule {}
