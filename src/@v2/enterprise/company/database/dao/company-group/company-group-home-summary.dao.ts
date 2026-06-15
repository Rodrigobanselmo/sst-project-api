import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { riskAllId } from '@/shared/constants/ids';

export type CompanyGroupHomeSummaryData = {
  employees: {
    active: number;
    inactive: number;
    away: number;
  };
  companyData: {
    hierarchies: number;
    workspaces: number;
    clinicsConnected: number;
  };
  characterization: {
    risks: number;
    exams: number;
    protocols: number;
    environments: number;
    epis: number;
    homogeneousGroups: number;
  };
};

@Injectable()
export class CompanyGroupHomeSummaryDAO {
  constructor(private readonly prisma: PrismaService) {}

  async aggregate(companyIds: string[]): Promise<CompanyGroupHomeSummaryData> {
    if (companyIds.length === 0) {
      return this.emptySummary();
    }

    const [
      active,
      inactive,
      away,
      hierarchies,
      workspaces,
      clinicsConnected,
      risks,
      exams,
      protocols,
      environments,
      epis,
      homogeneousGroups,
    ] = await Promise.all([
      this.prisma.employee.count({
        where: {
          companyId: { in: companyIds },
          status: 'ACTIVE',
          hierarchyId: { not: null },
        },
      }),
      this.prisma.employee.count({
        where: {
          companyId: { in: companyIds },
          hierarchyId: null,
          status: 'INACTIVE',
        },
      }),
      this.prisma.employee.count({
        where: {
          companyId: { in: companyIds },
          hierarchyId: { not: null },
          status: 'ACTIVE',
          absenteeisms: { some: { endDate: { lt: new Date() } } },
        },
      }),
      this.prisma.hierarchy.count({
        where: { companyId: { in: companyIds }, type: 'OFFICE' },
      }),
      this.prisma.workspace.count({
        where: { companyId: { in: companyIds }, deleted_at: null },
      }),
      this.prisma.companyClinics.count({
        where: { companyId: { in: companyIds } },
      }),
      this.prisma.riskFactors.count({
        where: {
          riskFactorData: {
            some: {
              companyId: { in: companyIds },
              riskId: { not: riskAllId },
            },
          },
        },
      }),
      this.prisma.exam.count({
        where: {
          OR: [
            {
              examToRiskData: {
                some: { risk: { companyId: { in: companyIds } } },
              },
            },
            {
              examToRisk: {
                some: {
                  companyId: { in: companyIds },
                  deletedAt: null,
                },
              },
            },
          ],
        },
      }),
      this.prisma.protocol.count({
        where: {
          protocolToRisk: { some: { companyId: { in: companyIds } } },
        },
      }),
      this.prisma.companyCharacterization.count({
        where: { companyId: { in: companyIds } },
      }),
      this.prisma.epi.count({
        where: {
          epiToRiskFactorData: {
            some: {
              riskFactorData: { companyId: { in: companyIds } },
            },
          },
          ca: { notIn: ['0', '1', '2'] },
        },
      }),
      this.prisma.homogeneousGroup.count({
        where: { companyId: { in: companyIds } },
      }),
    ]);

    return {
      employees: { active, inactive, away },
      companyData: { hierarchies, workspaces, clinicsConnected },
      characterization: {
        risks,
        exams,
        protocols,
        environments,
        epis,
        homogeneousGroups,
      },
    };
  }

  private emptySummary(): CompanyGroupHomeSummaryData {
    return {
      employees: { active: 0, inactive: 0, away: 0 },
      companyData: { hierarchies: 0, workspaces: 0, clinicsConnected: 0 },
      characterization: {
        risks: 0,
        exams: 0,
        protocols: 0,
        environments: 0,
        epis: 0,
        homogeneousGroups: 0,
      },
    };
  }
}
