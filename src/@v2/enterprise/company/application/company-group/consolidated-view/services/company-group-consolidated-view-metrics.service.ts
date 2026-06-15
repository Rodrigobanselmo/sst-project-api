import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

export type ConsolidatedViewApplicationMetrics = {
  totalParticipants: number;
  totalAnswers: number;
};

@Injectable()
export class CompanyGroupConsolidatedViewMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetricsForApplications(
    applicationIds: string[],
  ): Promise<Map<string, ConsolidatedViewApplicationMetrics>> {
    if (applicationIds.length === 0) {
      return new Map();
    }

    const applications = await this.prisma.formApplication.findMany({
      where: { id: { in: applicationIds }, deleted_at: null },
      select: {
        id: true,
        company_id: true,
        participants: {
          select: {
            workspaces: { select: { workspace_id: true } },
          },
        },
      },
    });

    const answersData = await this.prisma.formParticipantsAnswers.groupBy({
      by: ['form_application_id'],
      where: {
        form_application_id: { in: applicationIds },
        status: 'VALID',
      },
      _count: { _all: true },
    });

    const answersMap = new Map(
      answersData.map((item) => [item.form_application_id, item._count._all]),
    );

    const metricsEntries = await Promise.all(
      applications.map(async (application) => {
        const workspaceIds =
          application.participants?.workspaces.map(
            (workspace) => workspace.workspace_id,
          ) || [];

        const totalParticipants =
          workspaceIds.length === 0
            ? 0
            : await this.prisma.employee.count({
                where: {
                  companyId: application.company_id,
                  status: 'ACTIVE',
                  hierarchy: {
                    workspaces: {
                      some: { id: { in: workspaceIds } },
                    },
                  },
                },
              });

        return [
          application.id,
          {
            totalParticipants,
            totalAnswers: answersMap.get(application.id) ?? 0,
          },
        ] as const;
      }),
    );

    return new Map(metricsEntries);
  }
}
