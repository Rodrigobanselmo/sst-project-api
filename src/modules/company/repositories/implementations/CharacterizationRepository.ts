import { RiskFactorsEntity } from './../../../checklist/entities/risk.entity';
import { RiskFactorDataEntity } from './../../../checklist/entities/riskData.entity';
import { Injectable } from '@nestjs/common';
import { CharacterizationTypeEnum, HomoTypeEnum, Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertCharacterizationDto } from '../../dto/characterization.dto';
import { CharacterizationEntity } from '../../entities/characterization.entity';
import { HierarchyEntity } from '../../entities/hierarchy.entity';

interface ICompanyCharacterization
  extends Omit<UpsertCharacterizationDto, 'photos'> {
  companyId: string;
  workspaceId: string;
}

export const isEnvironment = (type: CharacterizationTypeEnum) => {
  return (
    [
      CharacterizationTypeEnum.ADMINISTRATIVE,
      CharacterizationTypeEnum.OPERATION,
      CharacterizationTypeEnum.SUPPORT,
      CharacterizationTypeEnum.GENERAL,
    ] as CharacterizationTypeEnum[]
  ).includes(type);
};

export const getCharacterizationType = (type: CharacterizationTypeEnum) => {
  if (isEnvironment(type)) return HomoTypeEnum.ENVIRONMENT;

  return type as HomoTypeEnum;
};
@Injectable()
export class CharacterizationRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    id,
    companyId,
    workspaceId,
    hierarchyIds = [],
    type,
    profileParentId,
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
        type: getCharacterizationType(type),
      },
      update: {
        type: getCharacterizationType(type),
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

    const characterization = (await this.prisma.companyCharacterization.upsert({
      where: {
        workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
      },
      create: {
        ...characterizationDto,
        profileParentId: profileParentId || undefined,
        id: newId,
        companyId,
        workspaceId,
        type: type,
        name: characterizationDto.name,
      },
      update: {
        type,
        profileParentId: profileParentId || undefined,
        ...characterizationDto,
      },
      include: { profiles: true },
    })) as CharacterizationEntity;

    characterization.profiles = await Promise.all(
      characterization.profiles?.map((profile) => {
        return this.upsert({
          id: profile.id,
          companyId,
          workspaceId,
          type,
          profileParentId: profile.profileParentId,
          ...(characterizationDto && {
            name: `${characterizationDto.name} - (${profile.profileName})`,
          }),
        });
      }),
    );

    return new CharacterizationEntity(characterization);
  }

  async find(
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
              CharacterizationTypeEnum.ACTIVITIES,
              CharacterizationTypeEnum.EQUIPMENT,
              CharacterizationTypeEnum.WORKSTATION,
            ],
          },
        },
        ...options,
      })) as CharacterizationEntity[];

    // //! optimization here, it has the hierarchy tree on front cam get only ids on hierarchyOnHomogeneous
    // await Promise.all(
    //   characterization.map(async (env, index) => {
    //     const hierarchies = await this.prisma.hierarchy.findMany({
    //       where: {
    //         hierarchyOnHomogeneous: { some: { homogeneousGroupId: env.id } },
    //         companyId,
    //       },
    //     });

    //     characterization[index].hierarchies = hierarchies.map(
    //       (hierarchy) => new HierarchyEntity(hierarchy),
    //     );
    //   }),
    // );

    return [...characterization.map((env) => new CharacterizationEntity(env))];
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
          profileParentId: null,
        },
        ...options,
      })) as CharacterizationEntity[];

    // //! optimization here, it has the hierarchy tree on front cam get only ids on hierarchyOnHomogeneous
    // await Promise.all(
    //   characterization.map(async (env, index) => {
    //     const hierarchies = await this.prisma.hierarchy.findMany({
    //       where: {
    //         hierarchyOnHomogeneous: { some: { homogeneousGroupId: env.id } },
    //         companyId,
    //       },
    //     });

    //     characterization[index].hierarchies = hierarchies.map(
    //       (hierarchy) => new HierarchyEntity(hierarchy),
    //     );
    //   }),
    // );

    return [...characterization.map((env) => new CharacterizationEntity(env))];
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
        include: { photos: true, profiles: true, ...options.include },
      })) as CharacterizationEntity;

    if (characterization) {
      const characterizationChildrenWithRisk = await Promise.all(
        characterization.profiles?.map(async (child) => {
          const profile = await this.getHierarchiesAndRisks(
            child.id,
            child,
            options,
          );
          return profile;
        }),
      );

      characterization.profiles = characterizationChildrenWithRisk;
    }

    return this.getHierarchiesAndRisks(id, characterization, options);
  }

  async delete(id: string, companyId: string, workspaceId: string) {
    const characterization = await this.prisma.companyCharacterization.delete({
      where: {
        workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
      },
    });

    return new CharacterizationEntity(characterization);
  }

  private async getHierarchiesAndRisks(
    id: string,
    characterization: CharacterizationEntity,
    options: {
      getRiskData?: boolean;
    } = {},
  ) {
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

    return new CharacterizationEntity(characterization);
  }
}
