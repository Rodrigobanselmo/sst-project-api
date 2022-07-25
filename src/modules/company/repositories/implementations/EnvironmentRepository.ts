import { Injectable } from '@nestjs/common';
import { CharacterizationTypeEnum, HomoTypeEnum, Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertCharacterizationDto } from '../../dto/characterization.dto';
import { EnvironmentEntity } from '../../entities/environment.entity';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { RiskFactorsEntity } from './../../../checklist/entities/risk.entity';
import { RiskFactorDataEntity } from './../../../checklist/entities/riskData.entity';

interface ICompanyCharacterization
  extends Omit<UpsertCharacterizationDto, 'photos'> {
  companyId: string;
  workspaceId: string;
}

@Injectable()
export class EnvironmentRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    id,
    companyId,
    workspaceId,
    hierarchyIds = [],
    ...characterizationDto
  }: ICompanyCharacterization): Promise<EnvironmentEntity> {
    const newId = v4();

    const homogeneousGroup = await this.prisma.homogeneousGroup.upsert({
      where: { id: id || 'no-id' },
      create: {
        id: newId,
        name: newId,
        //! optimization here nd on characterization
        description:
          characterizationDto.name + '(//)' + characterizationDto.type,
        companyId: companyId,
        type: HomoTypeEnum.ENVIRONMENT,
      },
      update: {
        description:
          characterizationDto.name + '(//)' + characterizationDto.type,
      },
    });

    await this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { homogeneousGroupId: homogeneousGroup.id },
    });

    //homoHierarchy
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
            // include: { hierarchy: true },
          }),
      ),
    );
    const characterization = (await this.prisma.companyCharacterization.upsert({
      where: {
        workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
      },
      create: {
        ...characterizationDto,
        id: newId,
        companyId,
        workspaceId,
        name: characterizationDto.name,
        type: characterizationDto.type,
      },
      update: {
        ...characterizationDto,
      },
    })) as EnvironmentEntity;

    return new EnvironmentEntity(characterization);
  }

  async findAll(
    companyId: string,
    workspaceId: string,
    options?: Prisma.CompanyCharacterizationFindManyArgs,
  ) {
    const characterization =
      (await this.prisma.companyCharacterization.findMany({
        where: {
          workspaceId,
          companyId,
          type: {
            in: [
              CharacterizationTypeEnum.ADMINISTRATIVE,
              CharacterizationTypeEnum.GENERAL,
              CharacterizationTypeEnum.OPERATION,
              CharacterizationTypeEnum.SUPPORT,
            ],
          },
        },
        ...options,
      })) as EnvironmentEntity[];

    return [...characterization.map((env) => new EnvironmentEntity(env))];
  }

  async findById(
    id: string,
    options: Partial<
      Prisma.CompanyCharacterizationFindUniqueArgs & {
        getRiskData: boolean;
      }
    > = {},
  ) {
    const characterization =
      (await this.prisma.companyCharacterization.findUnique({
        where: { id },
        include: { photos: true, ...options.include },
      })) as EnvironmentEntity;

    const hierarchies = await this.prisma.hierarchy.findMany({
      where: {
        hierarchyOnHomogeneous: {
          some: { homogeneousGroupId: characterization.id },
        },
      },
    });

    if (options.getRiskData) {
      const riskData = await this.prisma.riskFactorData.findMany({
        where: {
          homogeneousGroupId: id,
        },
        include: { riskFactor: true },
      });

      characterization.riskData = riskData.map(({ riskFactor, ...risk }) => {
        return new RiskFactorDataEntity({
          ...risk,
          ...(riskFactor
            ? { riskFactor: new RiskFactorsEntity(riskFactor) }
            : {}),
        });
      });
    }

    characterization.hierarchies = hierarchies.map(
      (hierarchy) => new HierarchyEntity(hierarchy),
    );

    return new EnvironmentEntity(characterization);
  }

  async delete(id: string, companyId: string, workspaceId: string) {
    const characterization = await this.prisma.companyCharacterization.delete({
      where: {
        workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
      },
    });

    return new EnvironmentEntity(characterization);
  }
}
