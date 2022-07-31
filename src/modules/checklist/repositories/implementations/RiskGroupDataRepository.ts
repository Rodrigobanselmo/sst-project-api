import { isEnvironment } from './../../../company/repositories/implementations/CharacterizationRepository';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { RiskFactorGroupDataEntity } from '../../entities/riskGroupData.entity';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
import { m2mGetDeletedIds } from 'src/shared/utils/m2mFilterIds';
import { UsersRiskGroupEntity } from '../../entities/usersRiskGroup';

@Injectable()
export class RiskGroupDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({
    companyId,
    id,
    professionalsIds,
    users,
    ...createDto
  }: UpsertRiskGroupDataDto): Promise<RiskFactorGroupDataEntity> {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.upsert({
        create: {
          ...createDto,
          companyId,
          professionals: professionalsIds
            ? { connect: professionalsIds.map((prof) => ({ id: prof })) }
            : undefined,
        },
        update: {
          ...createDto,
          companyId,
          professionals: professionalsIds
            ? { connect: professionalsIds.map((prof) => ({ id: prof })) }
            : undefined,
        },
        where: { id_companyId: { companyId, id: id || 'not-found' } },
        include: {
          usersSignatures: !!users,
        },
      });

    if (users) {
      if (riskFactorGroupDataEntity.usersSignatures?.length) {
        await this.prisma.riskFactorGroupDataToUser.deleteMany({
          where: {
            userId: {
              in: m2mGetDeletedIds(
                riskFactorGroupDataEntity.usersSignatures,
                users,
                'userId',
              ),
            },
            riskFactorGroupDataId: riskFactorGroupDataEntity.id,
          },
        });
      }

      riskFactorGroupDataEntity.usersSignatures = await this.setUsersSignatures(
        users.map((user) => ({
          ...user,
          riskFactorGroupDataId: riskFactorGroupDataEntity.id,
        })),
      );
    }

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  async findAllByCompany(companyId: string) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findMany({
        where: { companyId },
      });

    return riskFactorGroupDataEntity.map(
      (data) => new RiskFactorGroupDataEntity(data),
    );
  }

  async findById(
    id: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorGroupDataSelect;
      include?: Prisma.RiskFactorGroupDataInclude;
    } = {},
  ) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findUnique({
        where: { id_companyId: { id, companyId } },
        ...options,
      });

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  async findAllDataById(
    id: string,
    workspaceId: string,
    companyId: string,
    options: {
      select?: Prisma.RiskFactorGroupDataSelect;
      include?: Prisma.RiskFactorGroupDataInclude;
    } = {},
  ) {
    const riskFactorGroupDataEntity =
      await this.prisma.riskFactorGroupData.findUnique({
        where: { id_companyId: { id, companyId } },
        include: {
          company: true,
          professionals: true,
          usersSignatures: { include: { user: true } },
          data: {
            where: {
              OR: [
                {
                  homogeneousGroup: {
                    hierarchyOnHomogeneous: {
                      some: {
                        OR: [
                          { workspaceId: workspaceId },
                          {
                            hierarchy: {
                              workspaces: {
                                some: { id: workspaceId },
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
            include: {
              adms: true,
              recs: true,
              generateSources: true,
              epiToRiskFactorData: { include: { epi: true } },
              engsToRiskFactorData: { include: { recMed: true } },
              riskFactor: true,
              dataRecs: true,
              hierarchy: {
                include: { employees: { select: { _count: true } } },
              },
              homogeneousGroup: {
                include: { characterization: true, environment: true },
              },
            },
          },
        },
      });

    riskFactorGroupDataEntity.data.map((data, index) => {
      if (
        data.homogeneousGroup.characterization &&
        isEnvironment(data.homogeneousGroup.characterization.type)
      ) {
        riskFactorGroupDataEntity.data[index].homogeneousGroup.environment =
          data.homogeneousGroup.characterization as any;
        riskFactorGroupDataEntity.data[
          index
        ].homogeneousGroup.characterization = data.homogeneousGroup.characterization =
          null;
      }
    });

    // const riskFactorGroupData = {
    //   ...riskFactorGroupDataEntity,
    // } as any;

    // riskFactorGroupData.data = riskFactorGroupDataEntity.data.map(
    //   (riskData) => {
    //     const data = { ...riskData } as any;
    //     if (
    //       data.homogeneousGroup &&
    //       data.homogeneousGroup.hierarchyOnHomogeneous
    //     )
    //       data.homogeneousGroup.hierarchies =
    //         riskData.homogeneousGroup.hierarchyOnHomogeneous.map(
    //           (hierarchy) => ({
    //             ...hierarchy.hierarchy,
    //             hierarchyId: hierarchy.hierarchyId,
    //           }),
    //         );
    //     return;
    //   },
    // );

    return new RiskFactorGroupDataEntity(riskFactorGroupDataEntity);
  }

  private async setUsersSignatures(usersSignatures: UsersRiskGroupEntity[]) {
    if (usersSignatures.length === 0) return [];
    const data = await this.prisma.$transaction(
      usersSignatures.map(({ user, userId, riskFactorGroupDataId, ...rest }) =>
        this.prisma.riskFactorGroupDataToUser.upsert({
          create: { riskFactorGroupDataId, userId, ...rest },
          update: { riskFactorGroupDataId, userId, ...rest },
          where: {
            userId_riskFactorGroupDataId: { riskFactorGroupDataId, userId },
          },
          include: { user: true },
        }),
      ),
    );

    return data as UsersRiskGroupEntity[];
  }
}
