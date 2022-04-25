import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateEpiDto, UpdateEpiDto } from '../../dto/epi.dto';
import { EpiEntity } from '../../entities/Epi.entity';

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
}
