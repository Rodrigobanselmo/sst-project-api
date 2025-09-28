import { simulateAwait } from '@/@v2/shared/utils/helpers/simulate-await';
import { Injectable } from '@nestjs/common';
import { CompositeEmailAdapter } from '../../../adapters/mail/composite-email.adapter';
import { CompanyCommunicationDAO } from '../../../database/dao/company/company.dao.js';
import { UserCommunicationDAO } from '../../../database/dao/user/user.dao.js';
import { EmailLogRepository } from '../../../database/repositories/email-log/email-log.repository';
import { EmailLogEntity } from '../../../domain/entities/email-log.entity';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { ISendEmailUseCase } from './send-email.types';

@Injectable()
export class SendEmailUseCase {
  constructor(
    private readonly emailService: CompositeEmailAdapter,
    private readonly emailLogRepository: EmailLogRepository,
    private readonly userDao: UserCommunicationDAO,
    private readonly companyDao: CompanyCommunicationDAO,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute({ type, ...props }: ISendEmailUseCase) {
    // Generate deduplication ID and check for duplicates if the flag is set
    const deduplicationId = this.generateDeduplicationId(type, props);

    if ('checkDuplicates' in props && props.checkDuplicates && deduplicationId) {
      const isDuplicate = await this.checkForDuplicate(deduplicationId);
      if (isDuplicate) {
        console.log(`Skipping duplicate ${type} email with deduplicationId: ${deduplicationId}`);
        return;
      }
    }

    const userPromise = 'userId' in props ? this.userDao.find({ id: props.userId }) : null;
    const companyPromise = 'companyId' in props ? this.companyDao.find({ id: props.companyId }) : null;

    const [user, company] = await Promise.all([userPromise, companyPromise]);

    const to_email = 'email' in props ? props.email : user?.email;

    if (!to_email) throw new Error('Email address is required');

    const entity = new EmailLogEntity({
      email: to_email,
      template: type,
      deduplicationId: deduplicationId,
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

  private generateDeduplicationId(type: string, props: any): string | null {
    // Generate deduplication ID based on email type and key properties
    switch (type) {
      case 'FORM_INVITATION':
        if (props.participantId && props.applicationId) {
          return `${type}:${props.participantId}:${props.applicationId}`;
        }
        break;

      case 'PASSWORD_RESET':
        if (props.userId || props.email) {
          const identifier = props.userId || props.email;
          return `${type}:${identifier}`;
        }
        break;

      case 'EMAIL_VERIFICATION':
        if (props.userId || props.email) {
          const identifier = props.userId || props.email;
          return `${type}:${identifier}`;
        }
        break;

      // Add more email types as needed
      default:
        // For unknown types, try to create a generic ID
        if (props.userId) {
          return `${type}:${props.userId}`;
        } else if (props.email) {
          return `${type}:${props.email}`;
        }
        break;
    }

    return null; // No deduplication for this email type/props combination
  }

  private async checkForDuplicate(deduplicationId: string): Promise<boolean> {
    const existingEmail = await this.prisma.emailLog.findFirst({
      where: {
        deduplicationId: deduplicationId,
      },
      select: { id: true },
    });

    return !!existingEmail;
  }
}
