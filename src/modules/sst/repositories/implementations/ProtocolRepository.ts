import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateProtocolDto, FindProtocolDto, UpdateProtocolDto, UpdateProtocolRiskDto } from '../../dto/protocol.dto';
import { ProtocolEntity } from '../../entities/protocol.entity';

@Injectable()
export class ProtocolRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateProtocolDto) {
    const protocol = await this.prisma.protocol.create({
      data: createCompanyDto,
    });

    return new ProtocolEntity(protocol);
  }

  async update({ id, companyId, ...createCompanyDto }: UpdateProtocolDto) {
    const protocol = await this.prisma.protocol.update({
      data: { ...createCompanyDto },
      where: { id_companyId: { companyId, id } },
    });

    return new ProtocolEntity(protocol);
  }

  async updateProtocolRiskREMOVE({ companyId, protocolIds, riskIds }: UpdateProtocolRiskDto) {
    const createArray = protocolIds
      .map((protocolId) => {
        return riskIds.map((riskId) =>
          this.prisma.protocolToRisk.upsert({
            where: { riskId_protocolId: { protocolId, riskId } },
            create: {
              protocolId,
              riskId,
              companyId,
            },
            update: {},
          }),
        );
      })
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);

    const data = await this.prisma.$transaction([
      this.prisma.protocolToRisk.deleteMany({
        where: { protocolId: { in: protocolIds }, riskId: { in: riskIds } },
      }),
      ...createArray,
    ]);

    return data.map((dt) => 'id' in dt && new ProtocolEntity(dt));
  }

  async find(query: Partial<FindProtocolDto>, pagination: PaginationQueryDto, options: Prisma.ProtocolFindManyArgs = {}) {
    const whereInit = {
      AND: [
        // {
        //   OR: [
        //     { companyId: query.companyId },
        //     {
        //       company: {
        //         OR: [
        //           {
        //             applyingServiceContracts: {
        //               some: { receivingServiceCompanyId: query.companyId },
        //             },
        //           },
        //           {
        //             receivingServiceContracts: {
        //               some: { applyingServiceCompanyId: query.companyId },
        //             },
        //           },
        //         ],
        //       },
        //     },
        //   ],
        // },
      ],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.protocol.count({
        where,
      }),
      this.prisma.protocol.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((protocol) => new ProtocolEntity(protocol)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.ProtocolFindManyArgs = {}) {
    const protocols = await this.prisma.protocol.findMany({
      ...options,
    });

    return protocols.map((protocol) => new ProtocolEntity(protocol));
  }

  async findFirstNude(options: Prisma.ProtocolFindFirstArgs = {}) {
    const protocol = await this.prisma.protocol.findFirst({
      ...options,
    });

    return new ProtocolEntity(protocol);
  }

  async deleteSoft(id: number) {
    const protocol = await this.prisma.protocol.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new ProtocolEntity(protocol);
  }
}
