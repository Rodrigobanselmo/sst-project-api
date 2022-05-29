import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateEpiDto,
  FindEpiDto,
  UpdateEpiDto,
  UpsertEpiDto,
} from '../../dto/epi.dto';
import { EpiEntity } from '../../entities/epi.entity';

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

  async update({
    id,
    ...createEpiDto
  }: UpdateEpiDto & { id: number }): Promise<EpiEntity> {
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
    console.log('batch' + i);
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
    const where = {};

    Object.entries(query).forEach(([key, value]) => {
      where[key] = {
        contains: value,
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
      }),
    ]);

    const count = response[0];

    return { data: response[1].map((epi) => new EpiEntity(epi)), count };
  }

  async findAll(): Promise<EpiEntity[]> {
    const epis = await this.prisma.epi.findMany();

    return epis.map((epi) => new EpiEntity(epi));
  }
}