import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { removeDuplicate } from '../../../../shared/utils/removeDuplicate';

import { PrismaService } from '../../../../prisma/prisma.service';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { CreateRiskDto, FindRiskDto, UpdateRiskDto, UpsertRiskDto } from '../../dto/risk.dto';
import { resolveRiskListOrderBy } from '../../utils/risk-list-order-by.util';
import { RiskFactorsEntity } from '../../entities/risk.entity';
import { IRiskRepository } from '../IRiskRepository.types';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { databaseFindChanges } from '../../../../shared/utils/databaseFindChanges';

type RiskDocPresenceField = 'isPGR' | 'isPPP' | 'isPCMSO' | 'isAso';

function normalizeQueryIntArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null) return undefined;
  const arr = Array.isArray(value) ? value : [value];
  const nums = arr
    .flatMap((item) =>
      typeof item === 'string' && item.includes(',')
        ? item.split(',').map((s) => s.trim()).filter(Boolean)
        : [item],
    )
    .map((x) => Number(x))
    .filter((n) => Number.isInteger(n));
  return nums.length ? nums : undefined;
}

/** Aligns with client getRiskDoc(): company docInfo row first, else contract-provider docInfo, else RiskFactors flags. */
function riskDocPresenceWhere(companyId: string, flag: RiskDocPresenceField): Prisma.RiskFactorsWhereInput {
  const companyRow: Prisma.RiskFactorsDocInfoWhereInput = {
    companyId,
    hierarchyId: null,
  };
  const fullScope: Prisma.RiskFactorsDocInfoWhereInput = {
    hierarchyId: null,
    OR: [
      { companyId },
      {
        company: {
          applyingServiceContracts: {
            some: { receivingServiceCompanyId: companyId, status: StatusEnum.ACTIVE },
          },
        },
      },
    ],
  };
  return {
    OR: [
      {
        docInfo: {
          some: {
            ...companyRow,
            [flag]: true,
          },
        },
      },
      {
        AND: [
          { NOT: { docInfo: { some: companyRow } } },
          {
            OR: [
              {
                docInfo: {
                  some: {
                    hierarchyId: null,
                    [flag]: true,
                    company: {
                      applyingServiceContracts: {
                        some: {
                          receivingServiceCompanyId: companyId,
                          status: StatusEnum.ACTIVE,
                        },
                      },
                    },
                  },
                },
              },
              {
                AND: [{ NOT: { docInfo: { some: fullScope } } }, { [flag]: true }],
              },
            ],
          },
        ],
      },
    ],
  };
}

@Injectable()
export class RiskRepository implements IRiskRepository {
  constructor(private prisma: PrismaService) {}

  async findIdsBySynonymousSearch({
    companyId,
    search,
    mustHaveRiskData,
  }: {
    companyId: string;
    search: string;
    mustHaveRiskData?: boolean;
  }) {
    const likeTerm = `%${search}%`;
    const withRiskDataClause = mustHaveRiskData
      ? Prisma.sql`AND EXISTS (
          SELECT 1
          FROM "RiskFactorData" rfd
          WHERE rfd."riskId" = rf."id" AND rfd."companyId" = ${companyId}
        )`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT rf."id"
      FROM "RiskFactors" rf
      WHERE
        (rf."companyId" = ${companyId} OR rf."system" = true)
        AND EXISTS (
          SELECT 1
          FROM unnest(rf."synonymous") AS s
          WHERE s ILIKE ${likeTerm}
        )
        ${withRiskDataClause}
    `;

    return rows.map((row) => row.id);
  }

  async create({ recMed, generateSource, subTypesIds, activities, ...createRiskDto }: CreateRiskDto, system: boolean): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.create({
      data: {
        ...createRiskDto,
        activities: activities as any,
        system,
        subTypes: subTypesIds?.length
          ? {
              createMany: {
                data: subTypesIds.map((id) => ({
                  sub_type_id: id,
                })),
              },
            }
          : undefined,
        recMed: {
          createMany: {
            data: recMed
              ? recMed.map(({ ...rm }) => ({
                  system,
                  companyId: createRiskDto.companyId,
                  ...rm,
                }))
              : [],
            skipDuplicates: true,
          },
        },
        generateSource: {
          createMany: {
            data: generateSource
              ? generateSource.map(({ ...gs }) => ({
                  system,
                  companyId: createRiskDto.companyId,
                  ...gs,
                }))
              : [],
            skipDuplicates: true,
          },
        },
      },
      include: { recMed: true, generateSource: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async update(
    {
      recMed,
      generateSource,
      id,
      subTypesIds,
      activities,
      ...createRiskDto
    }: UpdateRiskDto & {
      isAso?: boolean;
      isPGR?: boolean;
      isPCMSO?: boolean;
      isPPP?: boolean;
    },
    system: boolean,
    companyId: string,
  ): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.update({
      data: {
        activities: activities as any,
        recMed: {
          upsert: !recMed
            ? []
            : recMed.map(({ id, ...rm }) => {
                return {
                  create: { system, companyId, ...rm },
                  update: { system, ...rm },
                  where: { id: id || 'no-id' },
                };
              }),
        },
        generateSource: {
          upsert: !generateSource
            ? []
            : generateSource.map(({ id, ...gs }) => {
                return {
                  create: { system, companyId, ...gs },
                  update: { system, ...gs },
                  where: { id: id || 'no-id' },
                };
              }),
        },
        subTypes: subTypesIds
          ? {
              deleteMany: {},
              createMany: {
                data: subTypesIds.map((id) => ({
                  sub_type_id: id,
                })),
              },
            }
          : undefined,
        ...createRiskDto,
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
      include: { recMed: true, generateSource: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async upsert({ companyId: _, subTypesIds, activities, id, recMed, generateSource, ...upsertRiskDto }: UpsertRiskDto, system: boolean, companyId: string): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.upsert({
      create: {
        ...upsertRiskDto,
        activities: activities as any,
        system,
        companyId,
        subTypes: subTypesIds?.length
          ? {
              createMany: {
                data: subTypesIds.map((id) => ({
                  sub_type_id: id,
                })),
              },
            }
          : undefined,
        recMed: {
          createMany: {
            data: !recMed
              ? []
              : recMed.map(({ id, ...rm }) => ({
                  system,
                  ...rm,
                })),
            skipDuplicates: true,
          },
        },
        generateSource: {
          createMany: {
            data: !generateSource
              ? []
              : generateSource.map(({ id, ...gs }) => ({
                  system,
                  ...gs,
                })),
            skipDuplicates: true,
          },
        },
      },
      update: {
        ...upsertRiskDto,
        system,
        recMed: {
          upsert: !recMed
            ? []
            : recMed.map(({ id, ...rm }) => {
                return {
                  create: { system, ...rm },
                  update: { system, ...rm },
                  where: { id: id || 'no-id' },
                };
              }),
        },
        subTypes: subTypesIds
          ? {
              deleteMany: {},
              createMany: subTypesIds.length
                ? {
                    data: subTypesIds.map((id) => ({
                      sub_type_id: id,
                    })),
                  }
                : undefined,
            }
          : undefined,
        generateSource: {
          upsert: !generateSource
            ? []
            : generateSource.map(({ id, companyId, recMeds: _, ...gs }) => {
                return {
                  create: { system, companyId, ...gs },
                  update: { system, ...gs },
                  where: { id: id || 'no-id' },
                };
              }),
        },
      },
      where: { id_companyId: { companyId, id: id || 'no-id' } },
      include: { recMed: true, generateSource: true },
    });

    return new RiskFactorsEntity(risk);
  }

  async upsertMany(upsertRiskDtoMany: UpsertRiskDto[], system: boolean, companyId: string): Promise<RiskFactorsEntity[]> {
    const data = await Promise.all(
      upsertRiskDtoMany.map(async ({ companyId: _, subTypesIds, activities, id, esocialCode, recMed, generateSource, ...upsertRiskDto }) => {
        return await this.prisma.riskFactors.upsert({
          create: {
            ...upsertRiskDto,
            activities: activities as any,
            esocialCode: esocialCode || null,
            system,
            companyId,
            subTypes: subTypesIds?.length
              ? {
                  createMany: {
                    data: subTypesIds.map((id) => ({
                      sub_type_id: id,
                    })),
                  },
                }
              : undefined,
            recMed: {
              createMany: {
                data: !recMed
                  ? []
                  : recMed.map(({ id, ...rm }) => ({
                      system,
                      ...rm,
                    })),
                skipDuplicates: true,
              },
            },
            generateSource: {
              createMany: {
                data: !generateSource
                  ? []
                  : generateSource.map(({ id, ...rm }) => ({
                      system,
                      ...rm,
                    })),
                skipDuplicates: true,
              },
            },
          },
          update: {
            ...upsertRiskDto,
            esocialCode: esocialCode || null,
            system,
            subTypes: subTypesIds
              ? {
                  deleteMany: {},
                  createMany: subTypesIds.length
                    ? {
                        data: subTypesIds.map((id) => ({
                          sub_type_id: id,
                        })),
                      }
                    : undefined,
                }
              : undefined,
            recMed: {
              upsert: !recMed
                ? []
                : recMed.map(({ id, ...rm }) => {
                    return {
                      create: { system, ...rm },
                      update: { system, ...rm },
                      where: { id: id || 'no-id' },
                    };
                  }),
            },
            generateSource: {
              upsert: !generateSource
                ? []
                : generateSource.map(({ id, recMeds: _, ...gs }) => {
                    return {
                      create: { system, ...gs },
                      update: { system, ...gs },
                      where: { id: id || 'no-id' },
                    };
                  }),
            },
          },
          where: { id_companyId: { companyId, id: id || 'no-id' } },
          include: { recMed: true, generateSource: true },
        });
      }),
    );

    return data.map((risk) => new RiskFactorsEntity(risk));
  }

  async find(query: Partial<FindRiskDto>, pagination: PaginationQueryDto, options: Prisma.RiskFactorsFindManyArgs = {}) {
    const listSortBy = (query as { listSortBy?: string }).listSortBy;
    const listSortOrder = (query as { listSortOrder?: string }).listSortOrder?.toLowerCase() as
      | 'asc'
      | 'desc'
      | undefined;
    delete (query as { listSortBy?: string }).listSortBy;
    delete (query as { listSortOrder?: string }).listSortOrder;

    const riskTypes = (query as { riskTypes?: string[] }).riskTypes;
    const severities = normalizeQueryIntArray((query as { severities?: unknown }).severities);
    const riskSubTypeIds = normalizeQueryIntArray((query as { riskSubTypeIds?: unknown }).riskSubTypeIds);
    const mustIsPGR = (query as { mustIsPGR?: boolean }).mustIsPGR;
    const mustIsPPP = (query as { mustIsPPP?: boolean }).mustIsPPP;
    const mustIsPCMSO = (query as { mustIsPCMSO?: boolean }).mustIsPCMSO;
    const mustIsAso = (query as { mustIsAso?: boolean }).mustIsAso;
    delete (query as { riskTypes?: string[] }).riskTypes;
    delete (query as { severities?: number[] }).severities;
    delete (query as { riskSubTypeIds?: number[] }).riskSubTypeIds;
    delete (query as { mustIsPGR?: boolean }).mustIsPGR;
    delete (query as { mustIsPPP?: boolean }).mustIsPPP;
    delete (query as { mustIsPCMSO?: boolean }).mustIsPCMSO;
    delete (query as { mustIsAso?: boolean }).mustIsAso;

    const whereInit = {
      AND: [{ OR: [{ companyId: query.companyId }, { system: true }] }],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [
        'search',
        'companyId',
        'listSortBy',
        'listSortOrder',
        'riskTypes',
        'severities',
        'riskSubTypeIds',
        'mustIsPGR',
        'mustIsPPP',
        'mustIsPCMSO',
        'mustIsAso',
      ],
    });

    if ('search' in query && query.search) {
      const synonymousRiskIds = await this.findIdsBySynonymousSearch({
        companyId: String(query.companyId),
        search: query.search,
      });

      (where.AND as any).push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { cas: { contains: query.search, mode: 'insensitive' } },
          ...(synonymousRiskIds.length
            ? [{ id: { in: synonymousRiskIds } }]
            : []),
        ],
      } as typeof options.where);
      delete query.search;
    }

    if (riskTypes?.length) {
      (where.AND as any).push({ type: { in: riskTypes } });
    }
    if (severities?.length) {
      (where.AND as any).push({ severity: { in: severities } });
    }
    if (riskSubTypeIds?.length) {
      (where.AND as any).push({
        subTypes: { some: { sub_type_id: { in: riskSubTypeIds } } },
      });
    }
    const companyIdForDoc = query.companyId;
    if (mustIsPGR === true) {
      (where.AND as any).push(
        companyIdForDoc ? riskDocPresenceWhere(companyIdForDoc, 'isPGR') : { isPGR: true },
      );
    }
    if (mustIsPPP === true) {
      (where.AND as any).push(
        companyIdForDoc ? riskDocPresenceWhere(companyIdForDoc, 'isPPP') : { isPPP: true },
      );
    }
    if (mustIsPCMSO === true) {
      (where.AND as any).push(
        companyIdForDoc ? riskDocPresenceWhere(companyIdForDoc, 'isPCMSO') : { isPCMSO: true },
      );
    }
    if (mustIsAso === true) {
      (where.AND as any).push(
        companyIdForDoc ? riskDocPresenceWhere(companyIdForDoc, 'isAso') : { isAso: true },
      );
    }

    const orderBy = resolveRiskListOrderBy(listSortBy, listSortOrder);

    const response = await this.prisma.$transaction([
      this.prisma.riskFactors.count({
        where,
      }),
      this.prisma.riskFactors.findMany({
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
        orderBy,
      }),
    ]);

    return {
      data: response[1].map((data) => new RiskFactorsEntity(data)),
      count: response[0],
    };
  }

  async findById(
    id: string,
    companyId: string,
    options?: IPrismaOptions<{
      company?: boolean;
      recMed?: boolean;
      generateSource?: boolean;
    }>,
  ): Promise<RiskFactorsEntity> {
    const include = options.include || {};

    const risk = await this.prisma.riskFactors.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        company: !!include.company,
        recMed: !!include.recMed,
        generateSource: !!include.generateSource,
        subTypes: {
          include: {
            sub_type: true,
          },
        },
      },
    });

    return new RiskFactorsEntity(risk);
  }

  async findOneById(id: string, companyId: string, options?: Prisma.RiskFactorsFindUniqueArgs): Promise<RiskFactorsEntity> {
    const risk = await this.prisma.riskFactors.findUnique({
      where: { id_companyId: { id, companyId } },
      include: {
        recMed: true,
        generateSource: true,
        esocial: true,
        subTypes: {
          include: {
            sub_type: true,
          },
        },
      },
      ...options,
    });

    return new RiskFactorsEntity(risk as any);
  }

  async findAllByCompanyId(
    companyId: string,
    options?: IPrismaOptions<{
      company?: boolean;
      recMed?: boolean;
      generateSource?: boolean;
    }>,
  ): Promise<RiskFactorsEntity[]> {
    const where = options.where || {};
    const include = options.include || {};

    const risks = await this.prisma.riskFactors.findMany({
      where: { companyId, ...where },
      include: {
        company: !!include.company,
        recMed: !!include.recMed,
        generateSource: !!include.generateSource,
        subTypes: {
          include: {
            sub_type: true,
          },
        },
      },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk));
  }

  async findNude(options: Prisma.RiskFactorsFindManyArgs = {}) {
    const risks = await this.prisma.riskFactors.findMany({
      ...options,
    });

    return risks.map((companyClinic) => new RiskFactorsEntity(companyClinic));
  }

  async findRiskDataByHierarchies(
    hierarchyIds: string[],
    companyId: string,
    options: Prisma.RiskFactorsFindManyArgs & {
      date?: Date;
      selectEpi?: boolean;
      selectAdm?: boolean;
      selectEpc?: boolean;
      selectFont?: boolean;
    } = {},
  ) {
    const { date, selectEpi, selectAdm, selectEpc, selectFont, ...rest } = options;

    const risks = await this.findNude({
      ...rest,
      where: {
        representAll: false, // remove standard risk
        riskFactorData: {
          some: {
            ...(date && {
              AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }],
            }),
            companyId,
            homogeneousGroup: {
              hierarchyOnHomogeneous: {
                some: {
                  hierarchyId: { in: hierarchyIds },
                  ...(date && {
                    AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }],
                  }),
                },
              },
            },
          },
        },
        ...rest.where,
      },
      select: {
        name: true,
        severity: true,
        type: true,
        esocialCode: true,
        representAll: true,
        id: true,
        unit: true,
        isPGR: true,
        isAso: true,
        isPPP: true,
        isPCMSO: true,
        protocolToRisk: {
          where: {
            protocol: {
              status: 'ACTIVE',
            },
          },
          select: {
            minRiskDegree: true,
            minRiskDegreeQuantity: true,
            id: true,
            protocol: { select: { name: true, id: true } },
          },
        },
        docInfo: {
          where: {
            AND: [
              {
                OR: [
                  { companyId },
                  {
                    company: {
                      applyingServiceContracts: {
                        some: { receivingServiceCompanyId: companyId, status: 'ACTIVE' },
                      },
                    },
                  },
                ],
              },
              { OR: [{ hierarchyId: { in: hierarchyIds } }, { hierarchyId: null }] },
            ],
          },
        },
        examToRisk: {
          include: { exam: { select: { name: true, id: true } } },
          where: { companyId, deletedAt: null },
        },
        riskFactorData: {
          where: {
            ...(date && {
              AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }],
            }),
            companyId,
            homogeneousGroup: {
              hierarchyOnHomogeneous: {
                some: {
                  hierarchyId: { in: hierarchyIds },
                  ...(date && {
                    AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }],
                  }),
                },
              },
            },
          },
          include: {
            examsToRiskFactorData: {
              include: {
                exam: { select: { name: true, status: true } },
              },
            },
            homogeneousGroup: {
              include: {
                characterization: { select: { name: true, type: true } },
                environment: { select: { name: true, type: true } },
              },
            },
            ...(selectAdm && {
              engsToRiskFactorData: { select: { recMedId: true, recMed: { select: { medName: true, id: true } } } },
            }),
            ...(selectEpc && {
              adms: { select: { medName: true, id: true } },
            }),
            ...(selectEpi && {
              epiToRiskFactorData: { select: { epiId: true, epi: { select: { ca: true, equipment: true } } } },
            }),
            ...(selectFont && {
              generateSources: { select: { id: true, name: true } },
            }),
          },
        },
        ...rest.select,
      },
    });

    return risks;
  }

  async findCountNude(pagination: PaginationQueryDto, options: Prisma.RiskFactorsFindManyArgs = {}) {
    const response = await this.prisma.$transaction([
      this.prisma.riskFactors.count({
        where: options.where,
      }),
      this.prisma.riskFactors.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
      }),
    ]);

    return {
      data: response[1].map((employee) => new RiskFactorsEntity(employee)),
      count: response[0],
    };
  }

  async findAllAvailable(userCompanyId: string, options: Prisma.RiskFactorsFindManyArgs = {}): Promise<RiskFactorsEntity[]> {
    // const tenant: Prisma.RiskFactorsFindManyArgs['where']['AND'] = [
    const tenant = [
      {
        OR: [
          { companyId: userCompanyId },
          {
            company: {
              applyingServiceContracts: {
                some: { receivingServiceCompanyId: userCompanyId, status: StatusEnum.ACTIVE },
              },
            },
          },
          //! fix on front and back to only get from it's on company, but can see the risk (riskData) from other companies
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: userCompanyId },
              },
            },
          },
          { system: true },
        ],
      },
    ];

    const risks = await this.prisma.riskFactors.findMany({
      // orderBy: [{ type: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        companyId: true,
        representAll: true,
        severity: true,
        type: true,
        esocialCode: true,
        nr15lt: true,
        stel: true,
        tlv: true,
        activities: true,
        twa: true,
        unit: true,
        subTypes: {
          include: {
            sub_type: true,
          },
        },
        // _count: { select: { riskFactorData: true } },
        // recMed: { where: { deleted_at: null, AND: [...tenant] } },
        // generateSource: { where: { deleted_at: null, AND: [...tenant] } },
      },
      ...options,
      where: {
        AND: [...tenant],
        deleted_at: null,
        OR: [
          {
            type: { not: 'OUTROS' },
            severity: { not: 0 },
          },
          {
            type: 'OUTROS',
          },
          {
            representAll: true,
          },
        ],
        ...options.where,
      },
      // include: {
      //   recMed: { where: { deleted_at: null, AND: [...tenant] } },
      //   generateSource: { where: { deleted_at: null, AND: [...tenant] } },
      //   ...include,
      // },
    });

    return risks.map((risk) => new RiskFactorsEntity(risk as any));
  }

  async findSyncChanges({ lastPulledVersion, companyId, userId }: { lastPulledVersion: Date; companyId: string; userId: number }) {
    const options: Prisma.RiskFactorsFindManyArgs = {};
    options.select = {
      name: true,
      severity: true,
      type: true,
      cas: true,
      representAll: true,
      id: true,
      status: true,
    };
    options.where = {
      AND: [{ OR: [{ companyId }, { system: true }] }],
    };

    const changes = await databaseFindChanges({
      entity: RiskFactorsEntity,
      findManyFn: this.prisma.riskFactors.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return changes;
  }

  async DeleteByIdSoft(id: string): Promise<RiskFactorsEntity> {
    const riskFactors = await this.prisma.riskFactors.update({
      where: { id },
      data: { deleted_at: new Date(), status: 'INACTIVE' },
    });

    return new RiskFactorsEntity(riskFactors);
  }

  async DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<RiskFactorsEntity> {
    const riskFactors = await this.prisma.riskFactors.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date(), status: 'INACTIVE' },
    });

    return new RiskFactorsEntity(riskFactors);
  }
}
