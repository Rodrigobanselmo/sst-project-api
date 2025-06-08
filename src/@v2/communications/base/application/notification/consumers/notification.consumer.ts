import { QueueEvents } from '@/@v2/shared/constants/events';
import { Queue } from '../../../../../shared/adapters/queue/consumer/queue.interface';
import { Consumer } from '../../../../../shared/adapters/queue/consumer/sqs.queue.adapter';
import { NotificationUseCase } from '../use-cases/notification.usecase';

@Consumer(QueueEvents.SEND_NOTIFICATION)
export class NotificationConsumer implements Queue {
  constructor(private readonly notificationUseCase: NotificationUseCase) {}

  async consume(body: any): Promise<void> {
    if (!body || !body.type) throw new Error('Invalid message body received');

    await this.notificationUseCase.execute(body.type, body);
  }
}
