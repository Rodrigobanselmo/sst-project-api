import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateProtocolToRiskDto, FindProtocolToRiskDto, UpdateProtocolToRiskDto, UpsertManyProtocolToRiskDto } from '../../dto/protocol-to-risk.dto';
import { ProtocolToRiskEntity } from '../../entities/protocol.entity';

@Injectable()
export class ProtocolToRiskRepository {
  constructor(private prisma: PrismaService) {}

  async create({ ...createProtocolToRiskDto }: CreateProtocolToRiskDto): Promise<ProtocolToRiskEntity> {
    const redMed = await this.prisma.protocolToRisk.create({
      data: {
        ...createProtocolToRiskDto,
      },
    });

    return new ProtocolToRiskEntity(redMed);
  }

  async update({ id, companyId, ...createProtocolToRiskDto }: UpdateProtocolToRiskDto): Promise<ProtocolToRiskEntity> {
    const Exam = await this.prisma.protocolToRisk.update({
      data: {
        ...createProtocolToRiskDto,
      },
      where: { id_companyId: { companyId, id: id || 0 } },
    });

    return new ProtocolToRiskEntity(Exam);
  }

  async find(query: Partial<FindProtocolToRiskDto>, pagination: PaginationQueryDto, options: Prisma.ProtocolToRiskFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const include = { ...options?.include };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ protocol: { name: { contains: query.search, mode: 'insensitive' } } }, { risk: { name: { contains: query.search, mode: 'insensitive' } } }],
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.protocolToRisk.count({
        where,
      }),
      this.prisma.protocolToRisk.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { risk: { name: 'asc' } },
      }),
    ]);

    return {
      data: response[1].map((exam) => new ProtocolToRiskEntity(exam)),
      count: response[0],
    };
  }

  async createMany({ companyId, data }: UpsertManyProtocolToRiskDto) {
    await this.prisma.protocolToRisk.createMany({
      data: data.map(({ id, ...examRisk }) => ({
        ...examRisk,
        companyId,
      })),
    });
  }

  async upsertMany({ companyId, data }: UpsertManyProtocolToRiskDto) {
    const dataUpsert = await this.prisma.$transaction(
      data.map(({ id, ...examRisk }) =>
        this.prisma.protocolToRisk.upsert({
          create: {
            ...examRisk,
            companyId,
          },
          update: {
            ...examRisk,
          },
          where: { id },
        }),
      ),
    );

    return dataUpsert.map((risk) => new ProtocolToRiskEntity(risk));
  }

  async findNude(options: Prisma.ProtocolToRiskFindManyArgs = {}): Promise<ProtocolToRiskEntity[]> {
    const exams = await this.prisma.protocolToRisk.findMany(options);

    return exams.map((exam) => new ProtocolToRiskEntity(exam));
  }
}
