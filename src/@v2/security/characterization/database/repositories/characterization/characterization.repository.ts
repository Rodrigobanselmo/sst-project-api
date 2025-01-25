import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client';
import { ICharacterizationRepository } from './characterization.types';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { Injectable } from '@nestjs/common';
import { CharacterizationMapper } from '../../mappers/entities/characterization.mapper';

@Injectable()
export class CharacterizationRepository implements ICharacterizationRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const select = {
      id: true,
      companyId: true,
      workspaceId: true,
      stageId: true,
    } satisfies Prisma.CompanyCharacterizationFindFirstArgs['select'];

    return { select };
  }

  async findById(params: ICharacterizationRepository.FindByIdParams): ICharacterizationRepository.FindByIdReturn {
    const characterization = await this.prisma.companyCharacterization.findFirst({
      where: {
        id: params.id,
        companyId: params.companyId,
        workspaceId: params.workspaceId,
      },
      ...CharacterizationRepository.selectOptions(),
    });

    return characterization ? CharacterizationMapper.toEntity({ ...characterization, ...params }) : null;
  }

  async update(params: ICharacterizationRepository.UpdateParams): ICharacterizationRepository.UpdateReturn {
    await this.prisma.companyCharacterization.update({
      where: {
        id: params.id,
        companyId: params.companyId,
        workspaceId: params.workspaceId,
      },
      data: {
        stageId: params.stageId,
      },
      select: { id: true },
    });
  }

  async updateMany(params: ICharacterizationRepository.UpdateManyParams): ICharacterizationRepository.UpdateManyReturn {
    await this.prisma.$transaction(async (tx) => {
      await asyncBatch({
        items: params,
        batchSize: 10,
        callback: async (params) => {
          await tx.companyCharacterization.update({
            where: {
              id: params.id,
              companyId: params.companyId,
              workspaceId: params.workspaceId,
            },
            data: {
              stageId: params.stageId,
            },
            select: { id: true },
          });
        },
      });
    });
  }
}
