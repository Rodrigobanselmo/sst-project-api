import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { SendEmailConsumer } from './base/application/email/consumers/send-email.consumer';
import { SendEmailUseCase } from './base/application/email/use-cases/send-email.usecase';
import { EmailLogRepository } from './base/database/repositories/email-log/email-log.repository';
import { ActionPlanCommunicationModule } from './security/action-plan/action-plan-communication.module';
import { NotificationConsumer } from './base/application/notification/consumers/notification.consumer';
import { NotificationUseCase } from './base/application/notification/use-cases/notification.usecase';
import { EmailModule } from './base/adapters/mail/email.module';
import { UserCommunicationDAO } from './base/database/dao/user/user.dao';
import { CompanyCommunicationDAO } from './base/database/dao/company/company.dao';
import { AuthCommunicationModule } from './auth/auth-communication.module';

@Module({
  imports: [SharedModule, EmailModule, ActionPlanCommunicationModule, AuthCommunicationModule],
  providers: [
    // Consumer
    SendEmailConsumer,
    NotificationConsumer,

    // Database
    EmailLogRepository,
    CompanyCommunicationDAO,
    UserCommunicationDAO,

    // Use Cases
    SendEmailUseCase,
    NotificationUseCase,
  ],
  exports: [SendEmailUseCase],
})
export class CommunicationModule {}
