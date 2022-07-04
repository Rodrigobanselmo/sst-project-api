import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertCharacterizationDto } from '../../dto/characterization.dto';
import { CharacterizationEntity } from '../../entities/characterization.entity';

interface ICompanyCharacterization
  extends Omit<UpsertCharacterizationDto, 'photos'> {
  companyId: string;
  workspaceId: string;
}

@Injectable()
export class CharacterizationRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    id,
    companyId,
    workspaceId,
    hierarchyIds = [],
    type,
    ...characterizationDto
  }: ICompanyCharacterization): Promise<CharacterizationEntity> {
    const newId = v4();

    const homogeneousGroup = await this.prisma.homogeneousGroup.upsert({
      where: { id: id || 'no-id' },
      create: {
        id: newId,
        name: newId,
        //! optimization here nd on characterization
        description: characterizationDto.name + '(//)' + type,
        companyId: companyId,
        type: type,
      },
      update: {
        description: characterizationDto.name + '(//)' + type,
      },
    });

    await this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { homogeneousGroupId: homogeneousGroup.id },
    });

    await Promise.all(
      hierarchyIds.map(
        async (hierarchyId) =>
          await this.prisma.hierarchyOnHomogeneous.upsert({
            where: {
              hierarchyId_homogeneousGroupId_workspaceId: {
                hierarchyId,
                workspaceId,
                homogeneousGroupId: homogeneousGroup.id,
              },
            },
            create: {
              hierarchyId,
              workspaceId,
              homogeneousGroupId: homogeneousGroup.id,
            },
            update: {},
          }),
      ),
    );

    const characterization = await this.prisma.companyCharacterization.upsert({
      where: {
        workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
      },
      create: {
        ...characterizationDto,
        id: newId,
        companyId,
        workspaceId,
        type: type,
        name: characterizationDto.name,
      },
      update: {
        ...characterizationDto,
      },
    });

    return new CharacterizationEntity(characterization);
  }

  async findAll(
    companyId: string,
    workspaceId: string,
    options?: Prisma.CompanyCharacterizationFindManyArgs,
  ) {
    const characterization = await this.prisma.companyCharacterization.findMany(
      {
        where: { workspaceId, companyId },
        ...options,
      },
    );

    return [...characterization.map((env) => new CharacterizationEntity(env))];
  }

  async findById(id: string) {
    const characterization =
      await this.prisma.companyCharacterization.findUnique({
        where: { id },
        include: { photos: true },
      });

    return new CharacterizationEntity(characterization);
  }

  async delete(id: string, companyId: string, workspaceId: string) {
    const characterization = await this.prisma.companyCharacterization.delete({
      where: {
        workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
      },
    });

    return new CharacterizationEntity(characterization);
  }
}
