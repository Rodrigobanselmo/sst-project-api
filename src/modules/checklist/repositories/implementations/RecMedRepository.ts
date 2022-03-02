import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { RecMedEntity } from '../../entities/recMed.entity';
import { IRecMedRepository } from '../IRecMedRepository.types';

@Injectable()
export class RecMedRepository implements IRecMedRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createRecMedDto: CreateRecMedDto,
    system: boolean,
  ): Promise<RecMedEntity> {
    const redMed = await this.prisma.recMed.create({
      data: {
        ...createRecMedDto,
        system,
      },
    });

    return new RecMedEntity(redMed);
  }

  async update(
    { id, ...createRecMedDto }: UpdateRecMedDto & { id: number },
    companyId: string,
  ): Promise<RecMedEntity> {
    const recMed = await this.prisma.recMed.update({
      data: {
        ...createRecMedDto,
      },
      where: { id_companyId: { companyId, id: id || -1 } },
    });

    return new RecMedEntity(recMed);
  }
}
