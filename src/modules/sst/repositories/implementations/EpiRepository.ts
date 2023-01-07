import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateEpiDto, FindEpiDto, UpdateEpiDto, UpsertEpiDto } from '../../dto/epi.dto';
import { EpiEntity } from '../../entities/epi.entity';
import { Prisma } from '@prisma/client';

let i = 0;

@Injectable()
export class EpiRepository {
  constructor(private prisma: PrismaService) {}

  async create(createEpiDto: CreateEpiDto): Promise<EpiEntity> {
    const redMed = await this.prisma.epi.create({
      data: {
        ...createEpiDto,
      },
    });

    return new EpiEntity(redMed);
  }

  async update({ id, ...createEpiDto }: UpdateEpiDto & { id: number }): Promise<EpiEntity> {
    const Epi = await this.prisma.epi.update({
      data: {
        ...createEpiDto,
      },
      where: { id },
    });

    return new EpiEntity(Epi);
  }

  async upsertMany(upsertDtoMany: UpsertEpiDto[]): Promise<EpiEntity[]> {
    i++;
    console.info('batch' + i);
    const data = await this.prisma.$transaction(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      upsertDtoMany.map(({ id: _, ca, ...upsertRiskDto }) =>
        this.prisma.epi.upsert({
          create: {
            ca,
            ...upsertRiskDto,
          },
          update: { ...upsertRiskDto },
          where: { ca_status: { status: 'ACTIVE', ca } },
        }),
      ),
    );

    return data.map((epi) => new EpiEntity(epi));
  }

  async findByCA(ca: string): Promise<EpiEntity> {
    const epi = await this.prisma.epi.findUnique({
      where: { ca_status: { ca, status: 'ACTIVE' } },
    });

    return new EpiEntity(epi);
  }

  async find(query: Partial<FindEpiDto>, pagination: PaginationQueryDto) {
    const where = {
      AND: [{ ca: { notIn: ['0', '1', '2', query?.ca || '0'] } }],
    };

    Object.entries(query).forEach(([key, value]) => {
      if (value)
        where[key] = {
          contains: value,
          mode: 'insensitive',
        };
    });

    const response = await this.prisma.$transaction([
      this.prisma.epi.count({
        where,
      }),
      this.prisma.epi.findMany({
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        // orderBy: { ca: 'asc' },
      }),
    ]);

    const standardEpis = [];
    // if (Object.keys(where).length === 0) {
    const epis = await this.prisma.epi.findMany({
      where: { ca: { in: query?.ca || ['0', '1', '2'] } },
    });

    standardEpis.push(...epis);
    // }

    const count = response[0];

    return {
      data: [...standardEpis, ...response[1]].map((epi) => new EpiEntity(epi)),
      count,
    };
  }

  async findNude(options: Prisma.EpiFindManyArgs = {}) {
    const contacts = await this.prisma.epi.findMany({
      ...options,
    });

    return contacts.map((contact) => new EpiEntity(contact));
  }

  async findAll(): Promise<EpiEntity[]> {
    const epis = await this.prisma.epi.findMany();

    return epis.map((epi) => new EpiEntity(epi));
  }

  async DeleteByIdSoft(id: number): Promise<EpiEntity> {
    const epis = await this.prisma.epi.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new EpiEntity(epis);
  }
}
