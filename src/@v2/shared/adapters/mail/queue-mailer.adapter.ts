import { Inject } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { MailAdapter } from './mail.interface';
import { Producer } from '../queue/producer';
import { QueueEvents } from '../../constants/events';

export class QueueMailerAdapter implements MailAdapter {
  constructor(
    @Inject(SharedTokens.Producer)
    private readonly producer: Producer,
  ) {}

  async sendMail(data: MailAdapter.SendMailData): Promise<any> {
    await this.producer.produce(QueueEvents.SEND_EMAIL, data, {
      groupId: data.type,
    });
  }
}
