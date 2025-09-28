import { EmailLog } from '@prisma/client';
import { EmailLogEntity } from '../../../domain/entities/email-log.entity';

export type IEmailLogEntityMapper = EmailLog;

export class EmailLogMapper {
  static toEntity(data: IEmailLogEntityMapper): EmailLogEntity {
    return new EmailLogEntity({
      id: data.id,
      email: data.email,
      template: data.template,
      createdAt: data.created_at || new Date(),
      data: (data.data as any) || undefined,
      deduplicationId: data.deduplicationId || undefined,
    });
  }
}
