import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { MailAdapter, ISendEmail } from '@/@v2/shared/adapters/mail/mail.interface';
import { config } from '@/@v2/shared/constants/config';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import { formatBannerText } from '@/@v2/forms/utils/format-banner-text';
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

    console.log(`[SendFormEmail] Starting email send for application ${params.applicationId}`);
    console.log(`[SendFormEmail] Specific participant IDs: ${params.participantIds?.length || 0}`);

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

      console.log(`[SendFormEmail] Page ${page}: Retrieved ${participants.results.length} participants`);
      console.log(`[SendFormEmail] Page ${page}: Email sent status breakdown:`, {
        sent: participants.results.filter((p) => p.emailSent).length,
        notSent: participants.results.filter((p) => !p.emailSent).length,
      });

      // Filter participants who haven't received email yet (if not sending to specific IDs)
      const participantsToAdd = !params.participantIds?.length ? participants.results.filter((participant) => !participant.emailSent) : participants.results;

      console.log(`[SendFormEmail] Page ${page}: After filtering, ${participantsToAdd.length} participants to add`);

      allParticipants = allParticipants.concat(participantsToAdd);

      // Check if we have more participants to fetch
      // Continue if we got a full page, as there might be more
      hasMore = participants.results.length === limit;
      page++;
    }

    console.log(`[SendFormEmail] Total participants to send email: ${allParticipants.length}`);

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

        const baseUrl = `${config.SYSTEM.APP_HOST}/formulario/${params.applicationId}`;
        const linkWithEmployeeId = `${baseUrl}?encrypt=${participant.encryptedEmployeeId}`;

        const isResend = !!params.participantIds?.length;

        const emailPayload = this.buildEmailPayload({
          formApplication,
          companyId: params.companyId,
          participantId: participant.id,
          applicationId: params.applicationId,
          link: linkWithEmployeeId,
          participantName: participant.name,
          email: participant.email,
          isResend,
          checkDuplicates: !isResend,
        });

        await this.mailAdapter.sendMail(emailPayload);

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

  private buildEmailPayload(params: {
    formApplication: FormApplicationAggregate;
    companyId: string;
    participantId: number;
    applicationId: string;
    link: string;
    participantName: string;
    email: string;
    isResend: boolean;
    checkDuplicates: boolean;
  }): ISendEmail {
    const { formApplication } = params;
    const basePayload = {
      email: params.email,
      companyId: params.companyId,
      participantId: params.participantId,
      applicationId: params.applicationId,
      link: params.link,
      form: {
        name: formApplication.form.name,
        description: formApplication.form.description,
      },
      application: {
        name: formApplication.formApplication.name,
        description: formApplication.formApplication.description,
      },
      participant: {
        name: params.participantName,
      },
      checkDuplicates: params.checkDuplicates,
    };

    if (params.isResend) {
      const entity = formApplication.formApplication;
      const isFrps = formApplication.form.type === FormTypeEnum.PSYCHOSOCIAL;

      const introText = entity.bannerIntroText?.trim() || (isFrps ? DEFAULT_FRPS_INTRO_TEXT : DEFAULT_GENERIC_INTRO_TEXT);
      const whyText = entity.bannerWhyText?.trim() || (isFrps ? DEFAULT_FRPS_WHY_TEXT : DEFAULT_GENERIC_WHY_TEXT);
      const contactText = entity.bannerContactText?.trim() || DEFAULT_GENERIC_CONTACT_TEXT;

      return {
        ...basePayload,
        type: 'FORM_INVITATION_REMINDER',
        banner: {
          introText: formatBannerText(introText),
          whyText: formatBannerText(whyText),
          contactText: formatBannerText(contactText),
        },
      };
    }

    return {
      ...basePayload,
      type: 'FORM_INVITATION',
    };
  }
}

const DEFAULT_FRPS_INTRO_TEXT =
  'O Programa de Gerenciamento de Riscos (PGR) está em andamento na sua empresa, com ações voltadas para identificar os Fatores de Riscos Psicossociais (FRPS) no ambiente laboral. Sua participação é fundamental.';

const DEFAULT_FRPS_WHY_TEXT =
  'Estamos aplicando o Copenhagen Psychosocial Questionnaire (COPSOQ III), um instrumento internacionalmente reconhecido e desenvolvido pelo Danish National Institute for Occupational Health. O questionário é anônimo e individual, garantindo total sigilo nas respostas. Ele nos ajudará a compreender os desafios psicossociais no trabalho e a planejar soluções eficazes para promover saúde mental e bem-estar.';

const DEFAULT_GENERIC_INTRO_TEXT =
  'Você ainda pode responder ao formulário. Sua participação é muito importante para que possamos obter resultados representativos e confiáveis.';

const DEFAULT_GENERIC_WHY_TEXT =
  'O questionário é individual e suas respostas são tratadas com total sigilo. Ele nos ajudará a compreender melhor o cenário atual e a planejar ações eficazes de melhoria.';

const DEFAULT_GENERIC_CONTACT_TEXT =
  'Entre em contato com o setor de RH da sua empresa ou diretamente com a SimpleSST: (51) 98348-5050';
