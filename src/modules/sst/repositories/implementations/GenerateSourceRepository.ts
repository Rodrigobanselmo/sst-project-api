import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateGenerateSourceDto, UpdateGenerateSourceDto } from '../../dto/generate-source.dto';
import { GenerateSourceEntity } from '../../entities/generateSource.entity';
import { IGenerateSourceRepository } from '../IGenerateSourceRepository.types';

@Injectable()
export class GenerateSourceRepository implements IGenerateSourceRepository {
  constructor(private prisma: PrismaService) {}

  async create({ recMeds, ...createGenerateSourceDto }: CreateGenerateSourceDto, system: boolean): Promise<GenerateSourceEntity> {
    const hasRecMed = recMeds ? recMeds.filter(({ recName, medName }) => recName || medName).length > 0 : false;

    const redMed = await this.prisma.generateSource.create({
      data: {
        ...createGenerateSourceDto,
        system,
        recMeds: hasRecMed
          ? {
              createMany: {
                data: recMeds.map(({ ...rm }) => ({
                  system,
                  ...rm,
                  riskId: createGenerateSourceDto.riskId,
                  companyId: createGenerateSourceDto.companyId,
                })),
                skipDuplicates: true,
              },
            }
          : undefined,
      },
      include: { recMeds: true },
    });

    return new GenerateSourceEntity(redMed);
  }

  async update(
    { id, recMeds, riskId, ...createGenerateSourceDto }: UpdateGenerateSourceDto & { id: string; riskId?: string },
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
                    create: { system, companyId, ...rm, riskId },
                    update: { system, ...rm, riskId },
                    where: { id: id || 'no-id' },
                  };
                }),
        },
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
    });

    await Promise.all(
      recMeds
        .filter(({ id, recName, medName }) => id && !recName && !medName)
        .map(async ({ id: _id }) => {
          await this.prisma.generateSource.update({
            data: {
              ...createGenerateSourceDto,
              recMeds: {
                connect: { id_companyId: { companyId, id: _id || 'no-id' } },
              },
            },
            where: { id_companyId: { companyId, id: id || 'no-id' } },
          });
        }),
    );

    return new GenerateSourceEntity(generateSource);
  }

  async findById(id: string, companyId: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.findUnique({
      where: { id_companyId: { id, companyId } },
    });

    return new GenerateSourceEntity(generate);
  }

  async DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date() },
    });

    return new GenerateSourceEntity(generate);
  }

  async DeleteByIdSoft(id: string): Promise<GenerateSourceEntity> {
    const generate = await this.prisma.generateSource.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new GenerateSourceEntity(generate);
  }
}
