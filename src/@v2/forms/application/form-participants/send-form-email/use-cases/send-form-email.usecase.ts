import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { config } from '@/@v2/shared/constants/config';
import { ISendFormEmailUseCase } from './send-form-email.types';

@Injectable()
export class SendFormEmailUseCase {
  constructor(
    private readonly formParticipantsDAO: FormParticipantsDAO,
    private readonly formApplicationRepository: FormApplicationAggregateRepository,
    private readonly prisma: PrismaServiceV2,
    @Inject(SharedTokens.Email) private readonly mailAdapter: MailAdapter,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async execute(params: ISendFormEmailUseCase.Params): Promise<ISendFormEmailUseCase.Result> {
    // No duplicate check here - will be handled in the consumer per participant

    // Get form application details
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: params.companyId,
    });

    if (!formApplication) {
      throw new BadRequestException('Form application not found');
    }

    // Get company details
    const company = await this.prisma.company.findFirst({
      where: { id: params.companyId },
      select: { id: true, name: true, logoUrl: true },
    });
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    // Get participants - either specific IDs or all participants
    let allParticipants: any[] = [];
    let page = 1;
    const limit = 500; // Process in batches for better performance
    let hasMore = true;

    while (hasMore) {
      const participants = await this.formParticipantsDAO.browse({
        page,
        limit,
        filters: {
          companyId: params.companyId,
          applicationId: params.applicationId,
          onlyWithEmail: true, // Only get participants with email addresses
          ...(params.participantIds?.length && { participantIds: params.participantIds }),
        },
        cryptoAdapter: this.cryptoAdapter,
      });

      allParticipants = allParticipants.concat(participants.results);

      // Check if we have more participants to fetch
      hasMore = participants.results.length === limit;
      page++;
    }

    if (!params.participantIds?.length) {
      allParticipants = allParticipants.filter((participant) => !participant.emailSent);
    }

    // Create a participants object that matches the expected structure
    const participants = {
      results: allParticipants,
      total: allParticipants.length,
    };

    if (!participants.results.length) {
      throw new BadRequestException('No participants found for this form application');
    }

    const results: ISendFormEmailUseCase.Result['participants'] = [];
    let emailsSent = 0;

    // Send emails to each participant
    for (const participant of participants.results) {
      try {
        if (!participant.email) {
          results.push({
            id: participant.id,
            name: participant.name,
            email: '',
            sent: false,
            error: 'No email address',
          });
          continue;
        }

        // Generate the form link with encrypted employee ID
        const baseUrl = `${config.SYSTEM.APP_HOST}/formulario/${params.applicationId}`;
        const linkWithEmployeeId = `${baseUrl}?encrypt=${participant.encryptedEmployeeId}`;

        // Send email with form and application details
        await this.mailAdapter.sendMail({
          type: 'FORM_INVITATION',
          email: participant.email,
          companyId: params.companyId,
          participantId: participant.id,
          applicationId: params.applicationId,
          link: linkWithEmployeeId,
          form: {
            name: formApplication.form.name,
            description: formApplication.form.description,
          },
          application: {
            name: formApplication.formApplication.name,
            description: formApplication.formApplication.description,
          },
          participant: {
            name: participant.name,
          },
          // Flag to indicate if consumer should check for duplicates
          checkDuplicates: !params.participantIds?.length, // true for bulk sends, false for specific participants
        });

        results.push({
          id: participant.id,
          name: participant.name,
          email: participant.email,
          sent: true,
        });

        emailsSent++;
      } catch (error) {
        results.push({
          id: participant.id,
          name: participant.name,
          email: participant.email || '',
          sent: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      emailsSent,
      participants: results,
    };
  }
}
