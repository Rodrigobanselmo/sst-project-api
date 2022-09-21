import { Module } from '@nestjs/common';
import { SendGridProvider } from '../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';

import { AuthModule } from '../auth/auth.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { CompanyModule } from '../company/company.module';
import { NotificationController } from './controller/notification.controller';
import { SendEmailService } from './services/send-email.service';

@Module({
  controllers: [NotificationController],
  imports: [AuthModule, CompanyModule, ChecklistModule],
  providers: [SendEmailService, SendGridProvider],
})
export class NotificationModule {}
