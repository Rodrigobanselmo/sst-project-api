import { QueueEvents } from '@/@v2/shared/constants/events';
import { Queue } from '../../../../../shared/adapters/queue/consumer/queue.interface';
import { Consumer } from '../../../../../shared/adapters/queue/consumer/sqs.queue.adapter';
import { SendEmailUseCase } from '../use-cases/send-email.usecase';

@Consumer(QueueEvents.SEND_EMAIL)
export class SendEmailConsumer implements Queue {
  constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

  async consume(body: any): Promise<void> {
    if (!body) throw new Error('Invalid message body received');
    if (!body.type) throw new Error('Invalid parameters: type is required');
    if (!body.email && !body.userId) throw new Error('Invalid parameters: email or userId is required');

    await this.sendEmailUseCase.execute(body);
  }
}
