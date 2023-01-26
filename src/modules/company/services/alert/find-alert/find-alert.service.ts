import { Injectable } from '@nestjs/common';
import { AlertsTypeEnum, Prisma } from '@prisma/client';
import sortArray from 'sort-array';

import { AlertRepository } from '../../../repositories/implementations/AlertRepository';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { AlertEntity } from './../../../entities/alert.entity';

@Injectable()
export class FindOneAlertService {
  constructor(private readonly alertRepository: AlertRepository, private readonly companyRepository: CompanyRepository) {}

  async execute(companyId: string, options?: Prisma.AlertFindManyArgs) {
    const alerts = await this.alertRepository.findOne(companyId, options);
    const alertsMap: Partial<Record<AlertsTypeEnum, AlertEntity>> = {};

    sortArray(
      alerts.map((alert) => {
        return {
          ...alert,
          isGroup: !!alert.company?.isGroup,
          isConsult: !alert.system ? !!alert.company?.isConsulting : false,
          isCompany: alert.companyId == companyId,
          isSystem: !!alert.system,
          system: !!alert.system,
        };
      }),
      {
        by: ['isCompany', 'isGroup', 'isConsult', 'isSystem'],
        order: ['asc', 'asc', 'asc', 'asc'],
      },
    ).forEach((alert) => {
      if (!alertsMap[alert.type])
        alertsMap[alert.type] = {
          companyId,
          type: alert.type,
          emails: [],
          groups: [],
          systemGroups: [],
          users: [],
          id: 0,
          system: false,
          configJson: {},
          nextAlert: null,
          defaultNextAlert: null,
        };

      if (alert.companyId == companyId) {
        alertsMap[alert.type].id = alert.id;
        alertsMap[alert.type].system = alert.system;
        alertsMap[alert.type].defaultNextAlert = alert.nextAlert;

        if (alert.emails) alertsMap[alert.type].emails.push(...alert.emails);
        if (alert.users) alertsMap[alert.type].users.push(...alert.users);
        if (alert.groups) alertsMap[alert.type].groups.push(...alert.groups);
        if (alert.configJson) {
          alertsMap[alert.type].configJson = alert.configJson;
          alertsMap[alert.type].nextAlert = alert.nextAlert;
        }
      } else {
        if (alert.configJson) {
          alertsMap[alert.type].nextAlert = alert.nextAlert;
          alertsMap[alert.type].configJson = alert.configJson;
        }
        alertsMap[alert.type].systemGroups.push(...alert.groups);
      }
    });

    return alertsMap;
  }
}
