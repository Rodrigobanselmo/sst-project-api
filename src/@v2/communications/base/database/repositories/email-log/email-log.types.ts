import { EmailLogEntity } from '../../../domain/entities/email-log.entity';

export namespace IEmailLogRepository {
  export type CreateParams = EmailLogEntity;
  export type CreateReturn = Promise<EmailLogEntity | null>;

  export type FindParams = { id: number; companyId: string };
  export type FindReturn = Promise<EmailLogEntity | null>;
}
