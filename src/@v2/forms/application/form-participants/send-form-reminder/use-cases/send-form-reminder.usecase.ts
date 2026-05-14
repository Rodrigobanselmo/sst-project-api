import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { config } from '@/@v2/shared/constants/config';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { formatBannerText } from '@/@v2/forms/utils/format-banner-text';
import { ISendFormReminderUseCase } from './send-form-reminder.types';

const REMINDER_LIMIT = 4;

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

@Injectable()
export class SendFormReminderUseCase {
  constructor(
    private readonly formParticipantsDAO: FormParticipantsDAO,
    private readonly formApplicationRepository: FormApplicationAggregateRepository,
    private readonly prisma: PrismaServiceV2,
    @Inject(SharedTokens.Email) private readonly mailAdapter: MailAdapter,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async execute(params: ISendFormReminderUseCase.Params): Promise<ISendFormReminderUseCase.Result> {
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: params.companyId,
    });

    if (!formApplication) {
      throw new BadRequestException('Form application not found');
    }

    const currentReminderCount = formApplication.formApplication.reminderCount;
    if (currentReminderCount >= REMINDER_LIMIT) {
      throw new BadRequestException(
        `Limite de ${REMINDER_LIMIT} rodadas de reforço atingido para esta aplicação de formulário.`,
      );
    }

    const company = await this.prisma.company.findFirst({
      where: { id: params.companyId },
      select: { id: true, name: true, logoUrl: true },
    });
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    const hasInitialSend = await this.checkInitialSendOccurred(params.applicationId);
    if (!hasInitialSend) {
      throw new BadRequestException(
        'O envio inicial de e-mails precisa ser realizado antes de enviar reforços em lote.',
      );
    }

    let allParticipants: any[] = [];
    let page = 1;
    const limit = 500;
    let hasMore = true;
    let totalWithoutEmail = 0;
    let totalAlreadyAnswered = 0;

    console.log(`[SendFormReminder] Starting batch reminder for application ${params.applicationId}`);

    while (hasMore) {
      const participants = await this.formParticipantsDAO.browse({
        page,
        limit,
        filters: {
          companyId: params.companyId,
          applicationId: params.applicationId,
          onlyWithEmail: true,
        },
        cryptoAdapter: this.cryptoAdapter,
      });

      for (const participant of participants.results) {
        if (participant.hasResponded) {
          totalAlreadyAnswered++;
          continue;
        }
        allParticipants.push(participant);
      }

      hasMore = participants.results.length === limit;
      page++;
    }

    const totalWithoutEmailResult = await this.countParticipantsWithoutEmail(params);
    totalWithoutEmail = totalWithoutEmailResult;

    console.log(`[SendFormReminder] Eligible participants: ${allParticipants.length}, already answered: ${totalAlreadyAnswered}, without email: ${totalWithoutEmail}`);

    if (allParticipants.length === 0) {
      const newCount = currentReminderCount;
      return {
        emailsSent: 0,
        skippedAlreadyAnswered: totalAlreadyAnswered,
        skippedWithoutEmail: totalWithoutEmail,
        reminderCount: newCount,
        reminderLimit: REMINDER_LIMIT,
        remainingReminders: REMINDER_LIMIT - newCount,
        participants: [],
      };
    }

    const entity = formApplication.formApplication;
    const isFrps = formApplication.form.type === FormTypeEnum.PSYCHOSOCIAL;

    const introText = entity.bannerIntroText?.trim() || (isFrps ? DEFAULT_FRPS_INTRO_TEXT : DEFAULT_GENERIC_INTRO_TEXT);
    const whyText = entity.bannerWhyText?.trim() || (isFrps ? DEFAULT_FRPS_WHY_TEXT : DEFAULT_GENERIC_WHY_TEXT);
    const contactText = entity.bannerContactText?.trim() || DEFAULT_GENERIC_CONTACT_TEXT;

    const results: ISendFormReminderUseCase.Result['participants'] = [];
    let emailsSent = 0;

    for (const participant of allParticipants) {
      try {
        const baseUrl = `${config.SYSTEM.APP_HOST}/formulario/${params.applicationId}`;
        const linkWithEmployeeId = `${baseUrl}?encrypt=${participant.encryptedEmployeeId}`;

        await this.mailAdapter.sendMail({
          type: 'FORM_INVITATION_REMINDER',
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
            name: entity.name,
            description: entity.description,
          },
          participant: {
            name: participant.name,
          },
          banner: {
            introText: formatBannerText(introText),
            whyText: formatBannerText(whyText),
            contactText: formatBannerText(contactText),
          },
          checkDuplicates: false,
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

    let newReminderCount = currentReminderCount;
    if (emailsSent > 0) {
      newReminderCount = currentReminderCount + 1;
      await this.prisma.formApplication.update({
        where: { id: params.applicationId },
        data: { reminder_count: newReminderCount },
      });
      console.log(`[SendFormReminder] Incremented reminder_count to ${newReminderCount}`);
    }

    return {
      emailsSent,
      skippedAlreadyAnswered: totalAlreadyAnswered,
      skippedWithoutEmail: totalWithoutEmail,
      reminderCount: newReminderCount,
      reminderLimit: REMINDER_LIMIT,
      remainingReminders: REMINDER_LIMIT - newReminderCount,
      participants: results,
    };
  }

  private async checkInitialSendOccurred(applicationId: string): Promise<boolean> {
    const result = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "EmailLog" el
      WHERE el."template" = 'FORM_INVITATION'
      AND el."deduplicationId" LIKE CONCAT('FORM_INVITATION:%:', ${applicationId})
      LIMIT 1
    `;
    return Number(result[0]?.count ?? 0) > 0;
  }

  private async countParticipantsWithoutEmail(params: ISendFormReminderUseCase.Params): Promise<number> {
    const withEmail = await this.formParticipantsDAO.browse({
      page: 1,
      limit: 1,
      filters: {
        companyId: params.companyId,
        applicationId: params.applicationId,
        onlyWithEmail: true,
      },
      cryptoAdapter: this.cryptoAdapter,
    });

    const all = await this.formParticipantsDAO.browse({
      page: 1,
      limit: 1,
      filters: {
        companyId: params.companyId,
        applicationId: params.applicationId,
      },
      cryptoAdapter: this.cryptoAdapter,
    });

    return Math.max(0, all.filterSummary.totalParticipants - withEmail.filterSummary.totalParticipants);
  }
}
