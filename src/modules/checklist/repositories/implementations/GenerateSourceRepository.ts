import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateGenerateSourceDto,
  UpdateGenerateSourceDto,
} from '../../dto/generate-source.dto';
import { GenerateSourceEntity } from '../../entities/generateSource.entity';
import { IGenerateSourceRepository } from '../IGenerateSourceRepository.types';

@Injectable()
export class GenerateSourceRepository implements IGenerateSourceRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createGenerateSourceDto: CreateGenerateSourceDto,
    system: boolean,
  ): Promise<GenerateSourceEntity> {
    const redMed = await this.prisma.generateSource.create({
      data: {
        ...createGenerateSourceDto,
        system,
      },
    });

    return new GenerateSourceEntity(redMed);
  }

  async update(
    {
      id,
      ...createGenerateSourceDto
    }: UpdateGenerateSourceDto & { id: number },
    companyId: string,
  ): Promise<GenerateSourceEntity> {
    const generateSource = await this.prisma.generateSource.update({
      data: {
        ...createGenerateSourceDto,
      },
      where: { id_companyId: { companyId, id: id || -1 } },
    });

    return new GenerateSourceEntity(generateSource);
  }
}
