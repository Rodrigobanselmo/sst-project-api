import { Injectable } from '@nestjs/common';
import { simulateAwait } from '@/@v2/shared/utils/helpers/simulate-await';
import { NodeMailerAdapter } from '../../../adapters/mail/node-mailer.adapter';
import { ISendEmailUseCase } from './send-email.types';
import { UserCommunicationDAO } from '../../../database/dao/user/user.dao.js';
import { CompanyCommunicationDAO } from '../../../database/dao/company/company.dao.js';
import { EmailLogRepository } from '../../../database/repositories/email-log/email-log.repository';
import { EmailLogEntity } from '../../../domain/entities/email-log.entity';

@Injectable()
export class SendEmailUseCase {
  constructor(
    private readonly emailService: NodeMailerAdapter,
    private readonly emailLogRepository: EmailLogRepository,
    private readonly userDao: UserCommunicationDAO,
    private readonly companyDao: CompanyCommunicationDAO,
  ) {}

  async execute({ type, ...props }: ISendEmailUseCase) {
    const userPromise = 'userId' in props ? this.userDao.find({ id: props.userId }) : null;
    const companyPromise = 'companyId' in props ? this.companyDao.find({ id: props.companyId }) : null;

    const [user, company] = await Promise.all([userPromise, companyPromise]);

    const to_email = 'email' in props ? props.email : user?.email;

    if (!to_email) throw new Error('Email address is required');

    const entity = new EmailLogEntity({
      email: to_email,
      template: type,
      data: {
        user: user || undefined,
        company: company || undefined,
        ...props,
      },
    });

    await this.emailLogRepository.create(entity, async () => {
      await this.emailService.sendMail({
        to: entity.email,
        type: type,
        variables: entity.data,
      });
    });

    await simulateAwait(1000); // Simulate a delay for the email sending process
  }
}
