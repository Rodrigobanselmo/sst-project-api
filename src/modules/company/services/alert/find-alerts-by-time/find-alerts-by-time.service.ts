import { CacheProvider } from './../../../../../shared/providers/CacheProvider/CacheProvider';
import { CacheTtlEnum } from './../../../../../shared/interfaces/cache.types';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { asyncBatch } from '../../../../../shared/utils/asyncBatch';

import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AlertSendDto } from '../../../dto/alert.dto';
import { AlertRepository } from '../../../repositories/implementations/AlertRepository';
import { SendAlertService } from '../send-alert/send-alert.service';
import { CompanyRepository } from './../../../repositories/implementations/CompanyRepository';
import { CacheEnum } from '../../../../..//shared/constants/enum/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class FindAlertsByTimeService {
  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly dayjsProvider: DayJSProvider,
    private readonly sendAlertService: SendAlertService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute() {
    const cache = new CacheProvider({
      cacheManager: this.cacheManager,
      ttlSeconds: CacheTtlEnum.HOUR_8,
    });

    const dateNext8h = this.dayjsProvider.addTime(new Date(), 8, 'h');
    const lowerDateNextAlert = this.dayjsProvider.addTime(new Date(), 30, 'm');

    const alertsSystem = await cache.funcResponse(
      () =>
        this.alertRepository.findNude({
          where: { nextAlert: { lte: dateNext8h }, system: true },
          select: { type: true, nextAlert: true },
        }),
      CacheEnum.ALERT_CRON + 0,
    );

    const alerts = await cache.funcResponse(
      () =>
        this.alertRepository.findNude({
          where: {
            nextAlert: { lte: dateNext8h },
            company: { status: 'ACTIVE' },
            system: false,
          },
          select: {
            type: true,
            nextAlert: true,
            company: {
              select: { id: true, isConsulting: true, isGroup: true },
            },
          },
        }),
      CacheEnum.ALERT_CRON + 1,
    );

    if (alertsSystem.length + alerts.length == 0) return;

    const systemAlertData = await Promise.all(
      alertsSystem
        .filter((alert) => alert.nextAlert <= lowerDateNextAlert)
        .map(async (alert) => {
          const alertWhere: Prisma.CompanyFindManyArgs['where'] = {
            OR: [
              { alerts: { some: { nextAlert: null, type: alert.type } } },
              { alerts: { none: { type: alert.type } } },
            ],
          };

          const companies = await this.companyRepository.findNude({
            select: { id: true },
            where: {
              status: 'ACTIVE',
              ...alertWhere,
              AND: [
                {
                  OR: [{ group: { companyGroup: { ...alertWhere } } }, { groupId: null }],
                },
                {
                  OR: [
                    {
                      receivingServiceContracts: {
                        some: { applyingServiceCompany: { ...alertWhere } },
                      },
                    },
                    {
                      receivingServiceContracts: {
                        none: { applyingServiceCompanyId: { gte: '' } },
                      },
                    },
                  ],
                },
              ],
            },
          });

          return companies.map((company) => ({
            type: alert.type,
            companyId: company.id,
          }));
        }),
    );

    const alertData = await Promise.all(
      alerts
        .filter((alert) => alert.nextAlert <= lowerDateNextAlert)
        .map(async (alert) => {
          const noneAlerts: Prisma.CompanyFindManyArgs['where'] = {
            OR: [
              { alerts: { some: { nextAlert: null, type: alert.type } } },
              { alerts: { none: { type: alert.type } } },
            ],
          };

          const companies = await this.companyRepository.findNude({
            select: { id: true },
            where: {
              status: 'ACTIVE',
              OR: [
                { id: alert.company.id },
                {
                  ...noneAlerts,
                  group: { companyGroup: { id: alert.company.id } },
                },
                {
                  AND: [
                    noneAlerts,
                    {
                      OR: [{ group: { companyGroup: { ...noneAlerts } } }, { groupId: null }],
                    },
                  ],
                  receivingServiceContracts: {
                    some: { applyingServiceCompanyId: alert.company.id },
                  },
                },
              ],
            },
          });
          return companies.map((company) => ({
            type: alert.type,
            companyId: company.id,
          }));
        }),
    );

    const sendDto: AlertSendDto[] = [...systemAlertData, ...alertData].flat(1);

    await asyncBatch(
      sendDto,
      20,
      async (sendData) => await this.sendAlertService.execute(sendData, sendData.companyId),
    );

    cache.clean(CacheEnum.ALERT_CRON + 0);
    cache.clean(CacheEnum.ALERT_CRON + 1);
  }
}
