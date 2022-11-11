import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { FindESocialEventDto } from '../../dto/esocial-event.dto';
import { EmployeeESocialEventEntity } from '../../entities/employeeEsocialEvent.entity';

@Injectable()
export class ESocialEventRepository {
  constructor(private prisma: PrismaService) {}
  async find(
    query: Partial<FindESocialEventDto>,
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeESocialEventFindManyArgs = {},
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
      created_at: true,
      updated_at: true,
      type: true,
      employee: { select: { name: true, id: true, cpf: true } },
      eventXml: true,
      response: true,
      employeeId: true,
      receipt: true,
      batchId: true,
      batch: { select: { environment: true } },
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

    if ('search' in query) {
      (where.AND as any).push({
        employee: {
          cpf: {
            contains: query.search ? onlyNumbers(query.search) || 'no' : '',
          },
        },
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
      this.prisma.employeeESocialEvent.count({
        where,
      }),
      this.prisma.employeeESocialEvent.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
        where,
      }),
    ]);

    return {
      data: response[1].map(
        (employee) => new EmployeeESocialEventEntity(employee),
      ),
      count: response[0],
    };
  }

  async updateNude(options: Prisma.EmployeeESocialEventUpdateArgs) {
    const employee = await this.prisma.employeeESocialEvent.update(options);

    return new EmployeeESocialEventEntity(employee);
  }

  async updateManyNude(options: Prisma.EmployeeESocialEventUpdateManyArgs) {
    await this.prisma.employeeESocialEvent.updateMany(options);
  }
}
