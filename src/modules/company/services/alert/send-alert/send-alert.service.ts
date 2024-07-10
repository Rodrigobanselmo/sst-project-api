import { AlertEntity } from './../../../entities/alert.entity';
import { EmailsEnum } from './../../../../../shared/constants/enum/emails';
import { clinicExamCloseToExpire } from './../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { CacheTtlEnum, ICacheAlertType } from './../../../../../shared/interfaces/cache.types';
import { CacheEnum } from './../../../../../shared/constants/enum/cache';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AlertSendDto } from '../../../dto/alert.dto';
import { AlertRepository } from '../../../repositories/implementations/AlertRepository';
import { FindOneAlertService } from '../find-alert/find-alert.service';
import { AlertsTypeEnum } from '@prisma/client';
import { resolve } from 'path';
import { NodeMailProvider } from './../../../../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';
import { UpsertAlertService } from '../upsert-alert/upsert-alert.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SendAlertService {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly upsertAlertService: UpsertAlertService,
    private readonly mailProvider: NodeMailProvider,
    private readonly dayjsProvider: DayJSProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly findOneAlertService: FindOneAlertService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute({ type }: AlertSendDto, companyId: string) {
    const cacheKey = CacheEnum.ALERT_NOTIFICATION.replace(':type', type).replace(':companyId', companyId);
    const shouldSkip: ICacheAlertType | null = await this.cacheManager.get(cacheKey);

    if (shouldSkip)
      throw new BadRequestException('Este alerta já foi enviado hoje, espere um dia caso queira enviar novamente');

    const findAlerts = await this.findOneAlertService.execute(companyId, {
      where: { type },
      include: {
        groups: {
          select: {
            name: true,
            id: true,
            companyId: true,
            users: {
              where: { companyId: companyId, status: 'ACTIVE' },
              select: { user: { select: { email: true } } },
            },
          },
        },
      },
    });

    const alert = findAlerts[type];

    const uniqueEmails = await this.getEmails(alert);
    if (!uniqueEmails?.length) {
      await this.updateNextAlertAlert(type, companyId, alert);
      return;
    }

    const templates = await this.getTemplateData(type, companyId);
    if (!templates || !templates?.variables?.expired?.length) {
      await this.updateNextAlertAlert(type, companyId, alert);
      return;
    }

    await this.mailProvider.sendMail({
      path: templates.path,
      subject: templates.subject,
      to: uniqueEmails,
      variables: templates.variables,
      source: EmailsEnum.REPORT,
    });

    const cacheValue: ICacheAlertType = true;
    await this.cacheManager.set(cacheKey, cacheValue, CacheTtlEnum.HOUR_1);
    await this.updateNextAlertAlert(type, companyId, alert);
  }

  async getEmails(alert: AlertEntity) {
    const emails = [];

    if (alert.emails) emails.push(...alert.emails);
    if (alert.users) emails.push(...alert.users.map((user) => user.email));
    if (alert.groups) emails.push(...alert.groups.map((group) => group.users.map((userGroup) => userGroup.user.email)));
    if (alert.systemGroups)
      emails.push(...alert.systemGroups.map((group) => group.users.map((userGroup) => userGroup.user.email)));

    const uniqueEmails = [...new Set(emails.flat(1))];

    return uniqueEmails;
  }

  async updateNextAlertAlert(type: AlertsTypeEnum, companyId: string, alert: AlertEntity) {
    if (alert.defaultNextAlert)
      await this.alertRepository.upsert({
        companyId,
        type,
        nextAlert: this.upsertAlertService.getNextDate(alert.configJson),
      });
  }

  async getTemplateData(type: AlertsTypeEnum, companyId: string) {
    if (type == AlertsTypeEnum.COMPANY_EXPIRED_EXAM) {
      return await this.getTemplateExamExpired(companyId);
    }

    return null;
  }

  async getTemplateExamExpired(companyId: string) {
    const closeDate = this.dayjsProvider.dayjs().add(clinicExamCloseToExpire, 'day').toDate();

    const expiredCount = await this.employeeRepository.countNude({
      where: {
        companyId: companyId,
        OR: [{ expiredDateExam: { lte: new Date() } }, { expiredDateExam: null }],
      },
    });
    const expiringSoonCount = await this.employeeRepository.countNude({
      where: {
        companyId: companyId,
        AND: [{ expiredDateExam: { gt: new Date() } }, { expiredDateExam: { lte: closeDate } }],
      },
    });

    const totalExams = expiredCount + expiringSoonCount;

    if (totalExams == 0) return null;

    const employees = await this.employeeRepository.find(
      { expiredExam: true, companyId: companyId },
      { take: totalExams > 20 ? 20 : totalExams },
    );

    const employeesData = employees.data.filter(
      (employee) => !employee.expiredDateExam || employee.expiredDateExam < closeDate,
    );

    const subject = 'Ralatórios - Exames Vencidos';
    const path = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'templates',
      'email',
      'alerts',
      'expiredExamAlert.hbs',
    );
    const variables = {
      scheduleLink: `${process.env.APP_HOST}/dashboard/empresas/${companyId}/agenda`,
      expiredCount,
      expiringSoonCount,
      moreThanCanShow: expiredCount + expiringSoonCount > 20,
      expired: employeesData.map((employee) => {
        const daysToExpire = this.dayjsProvider.dayjs(employee.expiredDateExam).diff(new Date(), 'days');

        return {
          employeeName: employee.name,
          cpf: employee.cpf,
          expirationDate: this.dayjsProvider.format(employee.expiredDateExam),
          daysToExpire: daysToExpire >= 0 ? daysToExpire : 'Expirado',
          isExpired: daysToExpire <= 0,
        };
      }),
    };

    return { variables, path, subject };
  }
}
