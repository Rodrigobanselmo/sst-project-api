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
    { recMeds, ...createGenerateSourceDto }: CreateGenerateSourceDto,
    system: boolean,
  ): Promise<GenerateSourceEntity> {
    const redMed = await this.prisma.generateSource.create({
      data: {
        ...createGenerateSourceDto,
        system,
        recMeds: {
          createMany: {
            data: recMeds
              ? recMeds.map(({ ...rm }) => ({
                  system,
                  ...rm,
                  riskId: createGenerateSourceDto.riskId,
                }))
              : [],
            skipDuplicates: true,
          },
        },
      },
    });

    return new GenerateSourceEntity(redMed);
  }

  async update(
    {
      id,
      recMeds,
      riskId,
      ...createGenerateSourceDto
    }: UpdateGenerateSourceDto & { id: number; riskId?: number },
    system: boolean,
    companyId: string,
  ): Promise<GenerateSourceEntity> {
    const generateSource = await this.prisma.generateSource.update({
      data: {
        ...createGenerateSourceDto,
        recMeds: {
          upsert: !recMeds
            ? []
            : recMeds
                .filter(({ recName, medName }) => recName || medName)
                .map(({ id, ...rm }) => {
                  return {
                    create: { system, ...rm, riskId },
                    update: { system, ...rm, riskId },
                    where: { id_companyId: { companyId, id: id || -1 } },
                  };
                }),
        },
      },
      where: { id_companyId: { companyId, id: id || -1 } },
    });

    await Promise.all(
      recMeds
        .filter(({ id, recName, medName }) => id && !recName && !medName)
        .map(async ({ id: _id }) => {
          await this.prisma.generateSource.update({
            data: {
              ...createGenerateSourceDto,
              recMeds: {
                connect: { id_companyId: { companyId, id: _id || -1 } },
              },
            },
            where: { id_companyId: { companyId, id: id || -1 } },
          });
        }),
    );

    return new GenerateSourceEntity(generateSource);
  }

  async findById(id: number, companyId: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.findUnique({
      where: { id_companyId: { id, companyId } },
    });

    return new GenerateSourceEntity(generate);
  }
}
