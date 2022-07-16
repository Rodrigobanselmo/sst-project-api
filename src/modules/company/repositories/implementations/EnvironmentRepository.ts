import { Injectable } from '@nestjs/common';
import { HomoTypeEnum, Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertEnvironmentDto } from '../../dto/environment.dto';
import { EnvironmentEntity } from '../../entities/environment.entity';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { RiskFactorsEntity } from './../../../checklist/entities/risk.entity';
import { RiskFactorDataEntity } from './../../../checklist/entities/riskData.entity';

interface ICompanyEnvironment extends Omit<UpsertEnvironmentDto, 'photos'> {
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
    ...environmentDto
  }: ICompanyEnvironment): Promise<EnvironmentEntity> {
    const newId = v4();

    const homogeneousGroup = await this.prisma.homogeneousGroup.upsert({
      where: { id: id || 'no-id' },
      create: {
        id: newId,
        name: newId,
        //! optimization here nd on characterization
        description: environmentDto.name + '(//)' + environmentDto.type,
        companyId: companyId,
        type: HomoTypeEnum.ENVIRONMENT,
      },
      update: {
        description: environmentDto.name + '(//)' + environmentDto.type,
      },
    });

    await this.prisma.hierarchyOnHomogeneous.deleteMany({
      where: { homogeneousGroupId: homogeneousGroup.id },
    });

    const homoHierarchy = await Promise.all(
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
    const environment = (await this.prisma.companyEnvironment.upsert({
      where: {
        workspaceId_companyId_id: { id: id || 'no-id', companyId, workspaceId },
      },
      create: {
        ...environmentDto,
        id: newId,
        companyId,
        workspaceId,
        name: environmentDto.name,
        type: environmentDto.type,
      },
      update: {
        ...environmentDto,
      },
    })) as EnvironmentEntity;

    // environment.hierarchies = homoHierarchy.map(
    //   (hh) => new HierarchyEntity(hh.hierarchy),
    // );

    return new EnvironmentEntity(environment);
  }

  async findAll(
    companyId: string,
    workspaceId: string,
    options?: Prisma.CompanyEnvironmentFindManyArgs,
  ) {
    const environment = (await this.prisma.companyEnvironment.findMany({
      where: { workspaceId, companyId },
      ...options,
    })) as EnvironmentEntity[];

    //! optimization here, it has the hierarchy tree on front cam get only ids on hierarchyOnHomogeneous
    // await Promise.all(
    //   environment.map(async (env, index) => {
    //     const hierarchies = await this.prisma.hierarchy.findMany({
    //       where: {
    //         hierarchyOnHomogeneous: { some: { homogeneousGroupId: env.id } },
    //         companyId,
    //       },
    //     });

    //     environment[index].hierarchies = hierarchies.map(
    //       (hierarchy) => new HierarchyEntity(hierarchy),
    //     );
    //   }),
    // );

    return [...environment.map((env) => new EnvironmentEntity(env))];
  }

  async findById(
    id: string,
    options: Partial<
      Prisma.CompanyEnvironmentFindUniqueArgs & {
        getRiskData: boolean;
      }
    > = {},
  ) {
    const environment = (await this.prisma.companyEnvironment.findUnique({
      where: { id },
      include: { photos: true, ...options.include },
    })) as EnvironmentEntity;

    const hierarchies = await this.prisma.hierarchy.findMany({
      where: {
        hierarchyOnHomogeneous: {
          some: { homogeneousGroupId: environment.id },
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

      environment.riskData = riskData.map(({ riskFactor, ...risk }) => {
        return new RiskFactorDataEntity({
          ...risk,
          ...(riskFactor
            ? { riskFactor: new RiskFactorsEntity(riskFactor) }
            : {}),
        });
      });
    }

    environment.hierarchies = hierarchies.map(
      (hierarchy) => new HierarchyEntity(hierarchy),
    );

    return new EnvironmentEntity(environment);
  }

  async delete(id: string, companyId: string, workspaceId: string) {
    const environment = await this.prisma.companyEnvironment.delete({
      where: {
        workspaceId_companyId_id: { workspaceId, companyId, id: id || 'no-id' },
      },
    });

    return new EnvironmentEntity(environment);
  }
}
