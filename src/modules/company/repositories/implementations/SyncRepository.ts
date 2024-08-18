import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { databaseFindChanges } from '../../../../shared/utils/databaseFindChanges';
import { RecMedEntity } from '../../../sst/entities/recMed.entity';
import { RiskFactorsEntity } from '../../../sst/entities/risk.entity';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
import { CompanyEntity } from '../../entities/company.entity';
import { EmployeeEntity } from '../../entities/employee.entity';

@Injectable()
export class SyncRepository {
  constructor(private prisma: PrismaService) { }

  async findSyncChanges({
    lastPulledVersion,
    companyStartIds,
    companyId,
    userId,
    companyIds,
  }: {
    companyStartIds?: string[];
    lastPulledVersion?: Date;
    companyId: string;
    userId: number;
    companyIds?: string[];
  }) {
    const riskChangeszPromise = await this.findRiskSyncChanges({ lastPulledVersion, companyId, userId });
    const recMedChangeszPromise = await this.findRecMedSyncChanges({ lastPulledVersion, companyId, userId });
    const generateSourceChangeszPromise = await this.findGenerateSourceSyncChanges({
      lastPulledVersion,
      companyId,
      userId,
    });

    const [riskChanges, recMedChanges, generateSourceChanges] = await Promise.all([
      riskChangeszPromise,
      recMedChangeszPromise,
      generateSourceChangeszPromise,
    ]);

    const changes: any = {
      Risk: riskChanges,
      RecMed: recMedChanges,
      GenerateSource: generateSourceChanges,
    };

    if (companyIds || companyStartIds) {
      if (companyStartIds) companyIds = companyStartIds;

      const companyChangesPromise = this.findCompanySyncChanges({
        companyIds: companyIds,
        lastPulledVersion: companyStartIds ? undefined : lastPulledVersion,
        userId,
      });
      const workspaceChangesPromise = this.findWorkspaceSyncChanges({
        companyIds: companyIds,
        lastPulledVersion: companyStartIds ? undefined : lastPulledVersion,
        userId,
      });

      const hierarchyChangesPromise = this.findHierarchySyncChanges({
        companyIds: companyIds,
        lastPulledVersion: companyStartIds ? undefined : lastPulledVersion,
        userId,
      });

      const employeesChangesPromise = this.findEmployeeSyncChanges({
        companyIds: companyIds,
        lastPulledVersion: companyStartIds ? undefined : lastPulledVersion,
        userId,
      });

      const [companyChanges, workspaceChanges, hierarchyChanges, employeesChanges] = await Promise.all([
        companyChangesPromise,
        workspaceChangesPromise,
        hierarchyChangesPromise,
        employeesChangesPromise,
      ]);

      changes.Company = companyChanges;
      changes.Workspace = workspaceChanges;
      changes.Hierarchy = hierarchyChanges;
      changes.Employee = employeesChanges;
      changes.MMWorkspaceHierarchy = {
        created: ([...hierarchyChanges.created, ...hierarchyChanges.updated] as HierarchyEntity[])
          .map((data) => {
            return data.workspaces.map((workspace) => ({
              id: workspace.id + data.id,
              hierarchyId: data.id,
              workspaceId: workspace.id,
              created_at: new Date(),
              updated_at: new Date(),
            }));
          })
          .flat(1),
        updated: [],
        deleted: [],
      };
    }

    return changes;
  }

  async findRecMedSyncChanges({
    lastPulledVersion,
    companyId,
    userId,
  }: {
    lastPulledVersion: Date;
    companyId: string;
    userId: number;
  }) {
    const options: Prisma.RecMedFindManyArgs = {};
    options.select = {
      recName: true,
      medName: true,
      medType: true,
      recType: true,
      riskId: true,
      id: true,
      status: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    };

    options.where = {
      AND: [
        {
          OR: [
            { companyId },
            { system: true },
            {
              company: { applyingServiceContracts: { some: { receivingServiceCompanyId: companyId } } },
            },
          ],
        },
      ],
    };

    const recMed = await databaseFindChanges({
      entity: RecMedEntity,
      findManyFn: this.prisma.recMed.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return recMed;
  }

  async findCompanySyncChanges({
    lastPulledVersion,
    companyIds,
    userId,
  }: {
    lastPulledVersion: Date;
    companyIds: string[];
    userId: number;
  }) {
    const options: Prisma.CompanyFindManyArgs = {};
    options.select = {
      cnpj: true,
      name: true,
      fantasy: true,
      id: true,
      logoUrl: true,
      isClinic: true,
      isConsulting: true,
      status: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    };

    options.where = {
      AND: [{ id: { in: companyIds } }],
    };

    const company = await databaseFindChanges({
      entity: CompanyEntity,
      findManyFn: this.prisma.company.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return company;
  }

  async findWorkspaceSyncChanges({
    lastPulledVersion,
    companyIds,
    userId,
  }: {
    lastPulledVersion: Date;
    companyIds: string[];
    userId: number;
  }) {
    const options: Prisma.WorkspaceFindManyArgs = {};
    options.select = {
      cnpj: true,
      name: true,
      id: true,
      abbreviation: true,
      description: true,
      companyId: true,
      status: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    };

    options.where = {
      AND: [{ companyId: { in: companyIds } }],
    };

    const company = await databaseFindChanges({
      entity: CompanyEntity,
      findManyFn: this.prisma.workspace.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return company;
  }

  async findRiskSyncChanges({
    lastPulledVersion,
    companyId,
    userId,
  }: {
    lastPulledVersion?: Date;
    companyId: string;
    userId: number;
  }) {
    const options: Prisma.RiskFactorsFindManyArgs = {};
    options.select = {
      name: true,
      severity: true,
      type: true,
      cas: true,
      representAll: true,
      id: true,
      status: true,
      activities: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    };

    options.where = {
      AND: [
        {
          OR: [
            { companyId },
            { system: true },
            {
              company: { applyingServiceContracts: { some: { receivingServiceCompanyId: companyId } } },
            },
          ],
        },
      ],
    };

    const riskChanges = await databaseFindChanges({
      entity: RiskFactorsEntity,
      sanitaze: (data: RiskFactorsEntity) => ({
        ...data,
        activities: !!data.activities?.length ? JSON.stringify(data.activities) : undefined,
      }),
      findManyFn: this.prisma.riskFactors.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return riskChanges;
  }

  async findGenerateSourceSyncChanges({
    lastPulledVersion,
    companyId,
    userId,
  }: {
    lastPulledVersion: Date;
    companyId: string;
    userId: number;
  }) {
    const options: Prisma.GenerateSourceFindManyArgs = {};
    options.select = {
      name: true,
      id: true,
      riskId: true,
      status: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    };

    options.where = {
      AND: [
        {
          OR: [
            { companyId },
            { system: true },
            {
              company: { applyingServiceContracts: { some: { receivingServiceCompanyId: companyId } } },
            },
          ],
        },
      ],
    };

    const generateSourceChanges = await databaseFindChanges({
      entity: RiskFactorsEntity,
      findManyFn: this.prisma.generateSource.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return generateSourceChanges;
  }

  async findHierarchiesSync({ companyId, workspaceId }: { workspaceId?: string; companyId?: string }) {
    const options: Prisma.HierarchyFindManyArgs = {};
    options.select = {
      name: true,
      id: true,
      status: true,
      type: true,
      description: true,
      realDescription: true,
      parentId: true,
      companyId: true,
      created_at: true,
      updated_at: true,
      deletedAt: true,
      workspaces: {
        select: { id: true },
        ...(workspaceId && {
          where: {
            id: workspaceId,
          },
        }),
      },
    };

    options.where = {
      AND: [
        {
          ...(companyId && { companyId }),
          ...(workspaceId && {
            workspaces: { some: { id: workspaceId } },
          }),
        },
      ],
    };

    const hierarchies = await this.prisma.hierarchy.findMany({
      ...options,
    });

    return hierarchies.map((hierarchy) => {
      return {
        ...hierarchy,
        workspaceIds: (hierarchy as any)?.workspaces?.map((workspace) => workspace.id),
      };
    });
  }

  async findHierarchySyncChanges({
    lastPulledVersion,
    companyIds,
    workspaceId,
    userId,
  }: {
    lastPulledVersion: Date;
    workspaceId?: string;
    companyIds: string[];
    userId: number;
  }) {
    const options: Prisma.HierarchyFindManyArgs = {};
    options.select = {
      name: true,
      id: true,
      status: true,
      type: true,
      description: true,
      realDescription: true,
      parentId: true,
      companyId: true,
      created_at: true,
      updated_at: true,
      deletedAt: true,
      workspaces: {
        select: { id: true },
        ...(workspaceId && {
          where: {
            id: workspaceId,
          },
        }),
      },
    };

    options.where = {
      AND: [
        {
          companyId: { in: companyIds },
          ...(workspaceId && {
            workspaces: { some: { id: workspaceId } },
          }),
        },
      ],
    };

    const hierarchyChanges = await databaseFindChanges({
      entity: HierarchyEntity,
      findManyFn: this.prisma.hierarchy.findMany,
      lastPulledVersion,
      options,
      userId,
      deletedAtKey: 'deletedAt',
    });

    return hierarchyChanges;
  }

  async findEmployeeSyncChanges({
    lastPulledVersion,
    companyIds,
    userId,
  }: {
    lastPulledVersion: Date;
    workspaceId?: string;
    companyIds: string[];
    userId: number;
  }) {
    const options: Prisma.EmployeeFindManyArgs = {};
    options.select = {
      name: true,
      id: true,
      status: true,
      hierarchyId: true,
      cpf: true,
      rg: true,
      socialName: true,
      companyId: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    };

    options.where = {
      AND: [
        {
          companyId: { in: companyIds },
        },
      ],
    };

    const employeeChanges = await databaseFindChanges({
      entity: EmployeeEntity,
      findManyFn: this.prisma.employee.findMany,
      lastPulledVersion,
      options,
      userId,
    });

    return employeeChanges;
  }


  async findCharacterizationChanges({
    workspaceId,
    companyId,
    lastSync
  }: {
    workspaceId: string;
    companyId: string;
    lastSync?: Date
  }) {

    const characterizations = await this.prisma.companyCharacterization.findMany({
      where: {
        companyId,
        workspaceId,
        ...(lastSync && {
          OR: [{
            updated_at: { gte: lastSync },
          }, {
            homogeneousGroup: {
              riskFactorData: {
                some: {
                  updatedAt: { gte: lastSync },
                }
              }
            }
          }]
        })
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        profileParentId: true,
        profileName: true,
        noiseValue: true,
        temperature: true,
        done_at: true,
        luminosity: true,
        moisturePercentage: true,
        files: true,
        status: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        homogeneousGroup: {
          select: {
            hierarchyOnHomogeneous: {
              select: {
                hierarchyId: true
              }
            },
            riskFactorData: {
              where: {
                endDate: null,
                deletedAt: null
              },
              select: {
                createdAt: true,
                updatedAt: true,
                id: true,
                probability: true,
                probabilityAfter: true,
                exposure: true,
                activities: true,
                riskId: true,
                recs: { select: { id: true, } },
                adms: { select: { id: true, } },
                generateSources: { select: { id: true, } },
                epiToRiskFactorData: {
                  include: { epi: { select: { ca: true, equipment: true, } } }
                },
                engsToRiskFactorData: {
                  select: {
                    recMedId: true,
                    efficientlyCheck: true,
                  }
                },
              }
            }
          }
        },
        photos: {
          select: {
            name: true,
            photoUrl: true,
            created_at: true,
            updated_at: true,
            deleted_at: true
          }
        }
      }
    })

    return characterizations;
  }
}

