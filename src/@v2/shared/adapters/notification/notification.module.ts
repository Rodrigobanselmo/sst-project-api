import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { QueueModule } from '../queue/queue.module';
import { QueueNotificationAdapter } from './queue-notification.adapter';

@Module({
  imports: [QueueModule],
  providers: [
    {
      provide: SharedTokens.Notification,
      useClass: QueueNotificationAdapter,
    },
  ],
  exports: [SharedTokens.Notification],
})
export class NotificationModule {}
