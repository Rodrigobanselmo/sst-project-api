import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateESocialBatch, FindESocialBatchDto } from '../../dto/esocial-batch.dto';
import { EmployeeESocialBatchEntity } from '../../entities/employeeEsocialBatch.entity';
import { Prisma, StatusEnum } from '@prisma/client';
import { onlyNumbers } from '@brazilian-utils/brazilian-utils';

@Injectable()
export class ESocialBatchRepository {
  constructor(private prisma: PrismaService) {}

  async create({ companyId, events, environment, status, type, examsIds, pppJson, ...rest }: CreateESocialBatch) {
    const pppTree = {};
    if (pppJson) {
      const pppHistory = await this.prisma.$transaction(
        pppJson.map((data) => {
          const eventDate = (data as any).event.eventDate;

          return this.prisma.employeePPPHistory.upsert({
            create: {
              json: data.json,
              doneDate: eventDate,
              employeeId: data.event.employee.id,
              sendEvent: false,
              status: status == StatusEnum.TRANSMITTED ? StatusEnum.DONE : StatusEnum.PENDING,
            },
            update: { json: data.json, sendEvent: false },
            where: {
              employeeId_doneDate: {
                doneDate: eventDate,
                employeeId: data.event.employee.id,
              },
            },
            select: { id: true },
          });
        }),
      );

      pppHistory.forEach((pppHistory, index) => {
        const event = pppJson[index].event;

        pppTree[`${event.employee.id}${event.id}`] = pppHistory.id;
      });
    }

    const batch = await this.prisma.employeeESocialBatch.create({
      data: {
        type,
        companyId,
        status,
        environment,
        ...(events.length > 0 &&
          status != StatusEnum.ERROR && {
            events: {
              create: events.map((event) => ({
                companyId,
                type,
                ...(pppTree[`${event.employeeId}${event.eventId}`] && {
                  pppId: pppTree[`${event.employeeId}${event.eventId}`],
                }),
                status: status == StatusEnum.TRANSMITTED ? StatusEnum.TRANSMITTED : StatusEnum.PROCESSING,
                ...event,
              })),
            },
          }),
        ...rest,
      },
    });

    if (examsIds)
      await this.prisma.employeeExamsHistory.updateMany({
        where: { id: { in: examsIds } },
        data: { sendEvent: false },
      });

    return new EmployeeESocialBatchEntity(batch);
  }

  async findNude(options: Prisma.EmployeeESocialBatchFindManyArgs = {}) {
    const data = await this.prisma.employeeESocialBatch.findMany({
      ...options,
    });

    return data.map((data) => new EmployeeESocialBatchEntity(data));
  }

  async find(
    query: Partial<FindESocialBatchDto>,
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeESocialBatchFindManyArgs = {},
  ) {
    const companyId = query.companyId;
    const whereInit = {
      AND: [
        ...(companyId
          ? [
              {
                company: {
                  OR: [
                    { id: companyId },
                    {
                      receivingServiceContracts: {
                        some: { applyingServiceCompanyId: companyId },
                      },
                    },
                  ],
                  ...options?.where,
                },
              },
            ]
          : []),
      ],
      ...options.where,
    } as typeof options.where;

    options.orderBy = {
      created_at: 'desc',
    };

    options.select = {
      id: true,
      environment: true,
      created_at: true,
      type: true,
      response: true,
      userTransmission: { select: { name: true, email: true } },
      company: {
        select: {
          id: true,
          name: true,
          group: { select: { id: true, name: true } },
          cnpj: true,
          fantasy: true,
          initials: true,
        },
      },
      companyId: true,
      status: true,
      ...options?.select,
    };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        company: {
          OR: [
            {
              group: { name: { contains: query.search, mode: 'insensitive' } },
            },
            { name: { contains: query.search, mode: 'insensitive' } },
            { fantasy: { contains: query.search, mode: 'insensitive' } },
            { initials: { contains: query.search, mode: 'insensitive' } },
            {
              cnpj: {
                contains: query.search ? onlyNumbers(query.search) || 'no' : '',
              },
            },
          ],
        },
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.employeeESocialBatch.count({
        where,
      }),
      this.prisma.employeeESocialBatch.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
        where,
      }),
    ]);

    return {
      data: response[1].map((employee) => new EmployeeESocialBatchEntity(employee)),
      count: response[0],
    };
  }

  async updateNude(options: Prisma.EmployeeESocialBatchUpdateArgs) {
    const employee = await this.prisma.employeeESocialBatch.update(options);

    return new EmployeeESocialBatchEntity(employee);
  }
}
