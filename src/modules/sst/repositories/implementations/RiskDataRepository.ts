import { m2mGetDeletedIds } from 'src/shared/utils/m2mFilterIds';
import { isEnvironment } from '../../../company/repositories/implementations/CharacterizationRepository';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  FindRiskDataDto,
  UpsertManyRiskDataDto,
  UpsertRiskDataDto,
} from '../../dto/risk-data.dto';
import { RiskFactorDataEntity } from '../../entities/riskData.entity';
import { Prisma, PrismaPromise } from '@prisma/client';
import { getMatrizRisk } from '../../../../shared/utils/matriz';
import { EpiRiskDataEntity } from '../../entities/epiRiskData.entity';
import { EpiRoRiskDataDto } from '../../dto/epi-risk-data.dto';
import { EngsRiskDataDto } from '../../dto/engs-risk-data.dto';
import { EngsRiskDataEntity } from '../../entities/engsRiskData.entity';
import { ExamsRiskDataDto } from '../../dto/exams-risk-data.dto';
import { ExamRiskDataEntity } from '../../entities/examRiskData.entity';

@Injectable()
export class RiskDataRepository {
  constructor(private prisma: PrismaService) {}
  async upsert(
    upsertRiskDataDto: Omit<UpsertRiskDataDto, 'keepEmpty' | 'type'>,
  ): Promise<RiskFactorDataEntity> {
    const level = await this.addLevel(upsertRiskDataDto);
    if (level) upsertRiskDataDto.level = level;

    const riskFactorData = await this.upsertPrisma(upsertRiskDataDto);

    return new RiskFactorDataEntity(riskFactorData);
  }

  async upsertConnectMany(
    upsertManyRiskDataDto: UpsertManyRiskDataDto,
  ): Promise<RiskFactorDataEntity[]> {
    const homogeneousGroupIds = upsertManyRiskDataDto.homogeneousGroupIds;
    if (homogeneousGroupIds) {
      delete upsertManyRiskDataDto.homogeneousGroupIds;
      delete upsertManyRiskDataDto.hierarchyIds;
      delete upsertManyRiskDataDto.riskIds;

      const level = await this.addLevel(upsertManyRiskDataDto);
      if (level) upsertManyRiskDataDto.level = level;

      const data = await Promise.all(
        homogeneousGroupIds.map(async (homogeneousGroupId) =>
          this.upsertConnectPrisma({
            homogeneousGroupId,
            ...upsertManyRiskDataDto,
          } as unknown as UpsertRiskDataDto),
        ),
      );

      return data.map(
        (riskFactorData) => new RiskFactorDataEntity(riskFactorData),
      );
    }
    return [];
  }

  async upsertMany(
    upsertManyRiskDataDto: UpsertManyRiskDataDto,
  ): Promise<RiskFactorDataEntity[]> {
    const homogeneousGroupIds = upsertManyRiskDataDto.homogeneousGroupIds;
    if (homogeneousGroupIds) {
      delete upsertManyRiskDataDto.homogeneousGroupIds;
      delete upsertManyRiskDataDto.hierarchyIds;
      delete upsertManyRiskDataDto.riskIds;

      const level = await this.addLevel(upsertManyRiskDataDto);
      if (level) upsertManyRiskDataDto.level = level;

      const data = await Promise.all(
        homogeneousGroupIds.map(async (homogeneousGroupId) =>
          this.upsertPrisma({
            homogeneousGroupId,
            ...upsertManyRiskDataDto,
          } as unknown as UpsertRiskDataDto),
        ),
      );

      return data.map(
        (riskFactorData) => new RiskFactorDataEntity(riskFactorData),
      );
    }
    return [];
  }

  async findAllByGroup(riskFactorGroupDataId: string, companyId?: string) {
    const riskFactorData = await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId },
      include: {
        adms: true,
        recs: true,
        generateSources: true,
        hierarchy: true,
        riskFactor: true,
        epiToRiskFactorData: { include: { epi: true } },
        engsToRiskFactorData: { include: { recMed: true } },
        examsToRiskFactorData: { include: { exam: true } },
        homogeneousGroup: {
          include: {
            hierarchyOnHomogeneous: { include: { hierarchy: true } }, //!
          },
        },
      },
    });
    return riskFactorData.map((data) => {
      const riskData = { ...data } as unknown as RiskFactorDataEntity;
      if (data.homogeneousGroup && data.homogeneousGroup.hierarchyOnHomogeneous)
        riskData.homogeneousGroup.hierarchies =
          data.homogeneousGroup.hierarchyOnHomogeneous.map((homo) => ({
            ...homo.hierarchy,
            workspaceId: homo.workspaceId,
          }));

      return new RiskFactorDataEntity(riskData);
    });
  }

  async findAllByGroupAndRisk(
    riskFactorGroupDataId: string,
    riskId: string,
    companyId: string,
  ) {
    const riskFactorData = (await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId, riskId },
      include: {
        adms: true,
        recs: true,
        generateSources: true,
        epiToRiskFactorData: { include: { epi: true } },
        engsToRiskFactorData: { include: { recMed: true } },
        examsToRiskFactorData: { include: { exam: true } },
      },
    })) as RiskFactorDataEntity[];

    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }

  async findAllActionPlan(
    riskFactorGroupDataId: string,
    workspaceId: string,
    companyId: string,
    query: Partial<FindRiskDataDto>,
    pagination: PaginationQueryDto,
  ) {
    const where = {
      AND: [
        {
          riskFactorGroupDataId,
          companyId,
          recs: { some: { recName: { contains: '' } } },
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
    } as Prisma.RiskFactorDataFindManyArgs['where'];

    // if ('search' in query) {
    //   (where.AND as any).push({
    //     OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
    //   } as Prisma.RiskFactorDataFindManyArgs['where']);
    //   delete query.search;
    // }

    // Object.entries(query).forEach(([key, value]) => {
    //   if (value)
    //     (where.AND as any).push({
    //       [key]: {
    //         contains: value,
    //         mode: 'insensitive',
    //       },
    //     } as Prisma.RiskFactorDataFindManyArgs['where']);
    // });

    const response = await this.prisma.$transaction([
      this.prisma.riskFactorData.count({
        where,
      }),
      this.prisma.riskFactorData.findMany({
        where,
        orderBy: { level: 'desc' },
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        include: {
          adms: true,
          recs: true,
          generateSources: true,
          riskFactor: true,
          dataRecs: { include: { comments: true } },
          epiToRiskFactorData: { include: { epi: true } },
          engsToRiskFactorData: { include: { recMed: true } },
          examsToRiskFactorData: { include: { exam: true } },
          homogeneousGroup: {
            include: { characterization: true, environment: true },
          },
        },
      }),
    ]);

    const riskData = await Promise.all(
      (response[1] as unknown as RiskFactorDataEntity[]).map(async (data) => {
        if (
          data.homogeneousGroup &&
          data.homogeneousGroup.type === 'HIERARCHY'
        ) {
          const hierarchy = await this.prisma.hierarchy.findUnique({
            where: { id: data.homogeneousGroup.id },
          });

          data.homogeneousGroup.hierarchy = hierarchy;
        }

        if (
          data.homogeneousGroup.characterization &&
          isEnvironment(data.homogeneousGroup.characterization.type)
        ) {
          data.homogeneousGroup.environment =
            data.homogeneousGroup.characterization;

          data.homogeneousGroup.characterization = null;
        }

        return new RiskFactorDataEntity(data);
      }),
    );

    return {
      data: riskData,
      count: response[0],
    };
  }

  async findAllByHomogeneousGroupId(
    companyId: string,
    riskFactorGroupDataId: string,
    homogeneousGroupId: string,
  ) {
    const riskFactorData = (await this.prisma.riskFactorData.findMany({
      where: { riskFactorGroupDataId, companyId, homogeneousGroupId },
      include: {
        adms: true,
        recs: true,
        epiToRiskFactorData: { include: { epi: true } },
        engsToRiskFactorData: { include: { recMed: true } },
        examsToRiskFactorData: { include: { exam: true } },
        generateSources: true,
      },
    })) as RiskFactorDataEntity[];

    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }

  async findAllByHierarchyId(
    companyId: string,
    // riskFactorGroupDataId: string,
    hierarchyId: string,
    options: Prisma.RiskFactorDataFindManyArgs = {},
  ) {
    const riskFactorData = (await this.prisma.riskFactorData.findMany({
      ...options,
      where: {
        // riskFactorGroupDataId,
        companyId,
        homogeneousGroup: { hierarchyOnHomogeneous: { some: { hierarchyId } } },
        ...options?.where,
      },
      include: {
        adms: {
          select: {
            medName: true,
            medType: true,
            id: true,
            riskId: true,
          },
        },
        recs: {
          select: {
            recName: true,
            recType: true,
            id: true,
            riskId: true,
          },
        },
        generateSources: true,
        epiToRiskFactorData: { include: { epi: true } },
        engsToRiskFactorData: {
          include: {
            recMed: {
              select: {
                medName: true,
                medType: true,
                id: true,
                riskId: true,
              },
            },
          },
        },
        examsToRiskFactorData: {
          include: {
            exam: { select: { name: true, status: true } },
          },
        },
        ...options.include,
      },
    })) as RiskFactorDataEntity[];

    return riskFactorData.map((data) => new RiskFactorDataEntity(data));
  }

  async findNude(options: Prisma.RiskFactorDataFindManyArgs = {}) {
    const response = await this.prisma.riskFactorData.findMany({
      ...options,
    });

    return response.map((exam) => new RiskFactorDataEntity(exam));
  }

  async deleteById(id: string) {
    const riskFactorData = await this.prisma.riskFactorData.delete({
      where: { id },
    });

    return new RiskFactorDataEntity(riskFactorData);
  }

  async deleteByIds(ids: string[]) {
    const riskFactorData = await this.prisma.riskFactorData.deleteMany({
      where: { id: { in: ids } },
    });

    return riskFactorData;
  }

  async deleteByHomoAndRisk(
    homogeneousGroupIds: string[],
    riskIds: string[],
    groupId: string,
  ) {
    const riskFactorData = await this.prisma.riskFactorData.deleteMany({
      where: {
        AND: [
          { homogeneousGroupId: { in: homogeneousGroupIds } },
          { riskId: { in: riskIds } },
          { riskFactorGroupDataId: groupId },
        ],
      },
    });

    return riskFactorData;
  }

  private async upsertPrisma({
    recs,
    adms,
    engs,
    epis,
    exams,
    generateSources,
    companyId,
    id,
    ...createDto
  }: Omit<UpsertRiskDataDto, 'keepEmpty'>) {
    const riskData = (await this.prisma.riskFactorData.upsert({
      create: {
        ...createDto,
        companyId,
        generateSources: generateSources
          ? {
              connect: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
        recs: recs
          ? {
              connect: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              connect: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      update: {
        ...createDto,
        companyId,
        recs: recs
          ? {
              set: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              set: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              set: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      where: {
        homogeneousGroupId_riskId_riskFactorGroupDataId: {
          riskFactorGroupDataId: createDto.riskFactorGroupDataId,
          riskId: createDto.riskId,
          homogeneousGroupId: createDto.homogeneousGroupId,
        },
      },
      include: {
        adms: true,
        recs: true,
        generateSources: true,
        epiToRiskFactorData: { include: { epi: true } },
        engsToRiskFactorData: !engs ? { include: { recMed: true } } : undefined,
        examsToRiskFactorData: { include: { exam: true } },
      },
    })) as RiskFactorDataEntity;

    if (epis) {
      if (riskData.epiToRiskFactorData?.length) {
        await this.prisma.epiToRiskFactorData.deleteMany({
          where: {
            riskFactorDataId: riskData.id,
            epiId: {
              in: m2mGetDeletedIds(riskData.epiToRiskFactorData, epis, 'epiId'),
            },
          },
        });
      }

      riskData.epiToRiskFactorData = await this.setEpis(
        epis.map((epi) => ({ ...epi, riskFactorDataId: riskData.id })),
      );
    }

    if (engs) {
      if (riskData.engsToRiskFactorData?.length) {
        await this.prisma.engsToRiskFactorData.deleteMany({
          where: {
            riskFactorDataId: riskData.id,
            recMedId: {
              in: m2mGetDeletedIds(
                riskData.engsToRiskFactorData,
                engs,
                'recMedId',
              ),
            },
          },
        });
      }

      riskData.engsToRiskFactorData = await this.setEngs(
        engs.map((eng) => ({
          ...eng,
          riskFactorDataId: riskData.id,
        })),
      );
    }

    if (exams) {
      if (riskData.examsToRiskFactorData?.length) {
        await this.prisma.examToRiskData.deleteMany({
          where: {
            riskFactorDataId: riskData.id,
            examId: {
              in: m2mGetDeletedIds(
                riskData.examsToRiskFactorData,
                exams,
                'examId',
              ),
            },
          },
        });
      }

      riskData.examsToRiskFactorData = await this.setExams(
        exams.map((exam) => ({ ...exam, riskFactorDataId: riskData.id })),
      );
    }

    return riskData;
  }

  private async upsertConnectPrisma({
    recs,
    adms,
    engs,
    epis,
    exams,
    generateSources,
    companyId,
    id,
    ...createDto
  }: Omit<UpsertRiskDataDto, 'keepEmpty'>) {
    const riskData = (await this.prisma.riskFactorData.upsert({
      create: {
        ...createDto,
        companyId,
        generateSources: generateSources
          ? {
              connect: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
        recs: recs
          ? {
              connect: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              connect: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      update: {
        ...createDto,
        companyId,
        recs: recs
          ? {
              connect: recs.map((id) => ({
                id,
              })),
            }
          : undefined,
        adms: adms
          ? {
              connect: adms.map((id) => ({
                id,
              })),
            }
          : undefined,
        generateSources: generateSources
          ? {
              connect: generateSources.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      where: {
        homogeneousGroupId_riskId_riskFactorGroupDataId: {
          riskFactorGroupDataId: createDto.riskFactorGroupDataId,
          riskId: createDto.riskId,
          homogeneousGroupId: createDto.homogeneousGroupId,
        },
      },
      include: {
        adms: true,
        recs: true,
        generateSources: true,
        epiToRiskFactorData: !epis ? { include: { epi: true } } : undefined,
        engsToRiskFactorData: !engs ? { include: { recMed: true } } : undefined,
        examsToRiskFactorData: !exams ? { include: { exam: true } } : undefined,
      },
    })) as RiskFactorDataEntity;

    if (epis)
      riskData.epiToRiskFactorData = await this.setEpis(
        epis.map((epi) => ({
          ...epi,
          riskFactorDataId: riskData.id,
        })),
      );

    if (engs)
      riskData.engsToRiskFactorData = await this.setEngs(
        engs.map((eng) => ({
          ...eng,
          riskFactorDataId: riskData.id,
        })),
      );

    if (exams)
      riskData.examsToRiskFactorData = await this.setExams(
        exams.map((exam) => ({
          ...exam,
          riskFactorDataId: riskData.id,
        })),
      );

    return riskData;
  }

  private async setEpis(epis: EpiRoRiskDataDto[]) {
    if (epis.length === 0) return [];
    const data = await this.prisma.$transaction(
      epis.map(({ riskFactorDataId, epiId, ...epiRelation }) =>
        this.prisma.epiToRiskFactorData.upsert({
          create: { riskFactorDataId, epiId, ...epiRelation },
          update: { riskFactorDataId, epiId, ...epiRelation },
          where: {
            riskFactorDataId_epiId: { riskFactorDataId, epiId },
          },
          include: { epi: true },
        }),
      ),
    );

    return data as EpiRiskDataEntity[];
  }

  private async setExams(exams: ExamsRiskDataDto[]) {
    if (exams.length === 0) return [];
    const data = await this.prisma.$transaction(
      exams.map(({ riskFactorDataId, examId, ...examRelation }) =>
        this.prisma.examToRiskData.upsert({
          create: { riskFactorDataId, examId, ...examRelation },
          update: { riskFactorDataId, examId, ...examRelation },
          where: {
            examId_riskFactorDataId: { riskFactorDataId, examId },
          },
          include: { exam: true },
        }),
      ),
    );

    return data as ExamRiskDataEntity[];
  }

  private async setEngs(engs: EngsRiskDataDto[]) {
    if (engs.length === 0) return [];
    const data = await this.prisma.$transaction(
      engs.map(({ riskFactorDataId, recMedId, ...rest }) =>
        this.prisma.engsToRiskFactorData.upsert({
          create: { riskFactorDataId, recMedId, ...rest },
          update: { riskFactorDataId, recMedId, ...rest },
          where: {
            riskFactorDataId_recMedId: { riskFactorDataId, recMedId },
          },
          include: { recMed: true },
        }),
      ),
    );

    return data as EngsRiskDataEntity[];
  }

  private async addLevel({
    riskId,
    probability,
  }: {
    riskId?: string;
    probability?: number;
  }) {
    let level = 0;
    if (probability && riskId) {
      const risk = await this.prisma.riskFactors.findUnique({
        where: {
          id: riskId,
        },
      });

      if (risk && risk.severity) {
        const matriz = getMatrizRisk(risk.severity, probability);

        level = matriz.level;
      }
    }

    return level;
  }
}