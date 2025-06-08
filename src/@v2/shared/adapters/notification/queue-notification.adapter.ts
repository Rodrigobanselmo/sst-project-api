import { Inject } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { NotificationAdapter } from './notification.interface';
import { Producer } from '../queue/producer';
import { QueueEvents } from '../../constants/events';

export class QueueNotificationAdapter implements NotificationAdapter {
  constructor(
    @Inject(SharedTokens.Producer)
    private readonly producer: Producer,
  ) {}

  async send(data: NotificationAdapter.SendNotificationData): Promise<any> {
    await this.producer.produce(QueueEvents.SEND_NOTIFICATION, data, {
      groupId: data.type,
    });
  }
}
