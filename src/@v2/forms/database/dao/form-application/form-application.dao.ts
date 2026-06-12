import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { FormApplicationOrderByEnum, IFormApplicationDAO } from './form-application.types';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { IFormApplicationBrowseResultModelMapper } from '../../mappers/models/form-application/form-application-browse-result.mapper';
import { IFormApplicationBrowseFilterModelMapper } from '../../mappers/models/form-application/form-application-browse-filter.mapper';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { FormApplicationBrowseModelMapper } from '../../mappers/models/form-application/form-application-browse.mapper';
import { Prisma } from '@prisma/client';
import { FormApplicationReadModelMapper } from '../../mappers/models/form-application/form-application-read.mapper';
import { FormApplicationReadPublicModelMapper } from '../../mappers/models/form-application/form-application-read-public.mapper';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import {
  FormApplicationScopeService,
  ResolvedFormApplicationScope,
} from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { formApplicationAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { FormParticipantsDAO } from '../form-participants/form-participants.dao';

@Injectable()
export class FormApplicationDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formApplicationScopeService: FormApplicationScopeService,
    private readonly formParticipantsDAO: FormParticipantsDAO,
  ) {}

  async read(params: IFormApplicationDAO.ReadParams) {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: formApplicationAccessWhere({
        formApplicationId: params.id,
        accessCompanyId: params.companyId,
      }),
      include: {
        form: true,
        participants: {
          include: {
            hierarchies: {
              include: {
                hierarchy: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            workspaces: {
              include: {
                workspaces: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        applicationCompanies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        question_identifier_group: {
          include: {
            data: {
              where: { deleted_at: null },
              take: 1,
            },
            questions: {
              where: { deleted_at: null },
              include: {
                data: {
                  where: { deleted_at: null },
                  take: 1,
                },
                question_details: {
                  include: {
                    data: {
                      where: { deleted_at: null },
                      take: 1,
                      include: {
                        question_identifier: true,
                      },
                    },
                    options: {
                      where: { deleted_at: null },
                      include: {
                        data: {
                          where: { deleted_at: null },
                          take: 1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!formApplication?.id) return null;

    const scope = await this.formApplicationScopeService.resolve({
      formApplicationId: params.id,
      accessCompanyId: params.companyId,
    });

    const workspaceIds =
      formApplication.participants?.workspaces.map(
        (workspace) => workspace.workspace_id,
      ) || [];

    const consolidatedParticipantCompanyIds =
      scope.scopeType === FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
        ? scope.participantCompanyIds
        : this.formApplicationScopeService.usesConsolidatedApplicationCompaniesParticipantScope(
              scope,
            )
          ? this.formApplicationScopeService.participantCompanyIdsForScope(
              scope,
            )
          : null;

    const totalParticipantsPromise = consolidatedParticipantCompanyIds
      ? this.prisma.employee.count({
          where: {
            companyId: { in: consolidatedParticipantCompanyIds },
            status: 'ACTIVE',
          },
        })
      : this.formApplicationScopeService.hasConvertedCompanies(scope)
        ? Promise.all([
            this.prisma.employee.count({
              where: {
                companyId: scope.anchorCompanyId,
                status: 'ACTIVE',
                hierarchy: {
                  workspaces: {
                    some: { id: { in: workspaceIds } },
                  },
                },
              },
            }),
            this.prisma.employee.count({
              where: {
                companyId: { in: scope.convertedCompanyIds },
                status: 'ACTIVE',
              },
            }),
          ]).then(([anchorCount, convertedCount]) => anchorCount + convertedCount)
        : this.prisma.employee.count({
              where: {
                companyId: params.companyId,
                status: 'ACTIVE',
                hierarchy: {
                  workspaces: {
                    some: {
                      id: { in: workspaceIds },
                    },
                  },
                },
              },
            });

    const answerStatus =
      formApplication.status === FormStatusEnum.TESTING ? 'TESTING' : 'VALID';

    const totalAnswersPromise = this.prisma.formParticipantsAnswers.count({
      where: {
        form_application_id: params.id,
        status: answerStatus,
      },
    });

    const respondedParticipantsCountPromise =
      this.formParticipantsDAO.countCampaignRespondedParticipants({
        companyId: params.companyId,
        applicationId: params.id,
        answerStatus,
      });

    const averageTimeSpentPromise = this.prisma.formParticipantsAnswers.aggregate({
      where: {
        form_application_id: params.id,
        status: formApplication.status === FormStatusEnum.TESTING ? 'TESTING' : 'VALID',
        time_spent: {
          not: null,
        },
      },
      _avg: {
        time_spent: true,
      },
    });

    const [
      totalParticipants,
      totalAnswers,
      respondedParticipantsCount,
      averageTimeSpentResult,
    ] = await Promise.all([
      totalParticipantsPromise,
      totalAnswersPromise,
      respondedParticipantsCountPromise,
      averageTimeSpentPromise,
    ]);

    return FormApplicationReadModelMapper.toModel({
      ...formApplication,
      totalParticipants,
      totalAnswers,
      respondedParticipantsCount,
      averageTimeSpent: averageTimeSpentResult._avg.time_spent,
    });
  }

  async readPublic(params: IFormApplicationDAO.ReadPublicParams) {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: params.id,
        deleted_at: null,
      },
      include: {
        form: {
          include: {
            questions_groups: {
              where: { deleted_at: null },
              include: {
                data: {
                  where: { deleted_at: null },
                  take: 1,
                },
                questions: {
                  where: { deleted_at: null },
                  include: {
                    data: {
                      where: { deleted_at: null },
                      take: 1,
                    },
                    question_details: {
                      include: {
                        data: {
                          where: { deleted_at: null },
                          take: 1,
                        },
                        options: {
                          where: { deleted_at: null },
                          include: {
                            data: {
                              where: { deleted_at: null },
                              take: 1,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        question_identifier_group: {
          where: { deleted_at: null },
          include: {
            data: {
              where: { deleted_at: null },
              take: 1,
            },
            questions: {
              where: { deleted_at: null },
              include: {
                data: {
                  where: { deleted_at: null },
                  take: 1,
                },
                question_details: {
                  include: {
                    data: {
                      where: { deleted_at: null },
                      take: 1,
                      include: {
                        question_identifier: true,
                      },
                    },
                    options: {
                      where: { deleted_at: null },
                      include: {
                        data: {
                          where: { deleted_at: null },
                          take: 1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return formApplication?.id ? FormApplicationReadPublicModelMapper.toModel(formApplication) : null;
  }

  async browse({ limit, page, orderBy, filters }: IFormApplicationDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    // Main query - get basic form application data without complex JOINs
    const formsPromise = this.prisma.$queryRaw<Omit<IFormApplicationBrowseResultModelMapper, 'total_answers' | 'total_participants' | 'average_time_spent'>[]>`
      SELECT
        form_ap."id" as id
        ,form_ap."name" as name
        ,form_ap."description" as description
        ,form_ap."company_id" as company_id
        ,form_ap."status" as status
        ,form_ap."ended_at" as end_date
        ,form_ap."started_at" as start_date
        ,form_ap."created_at" as created_at
        ,form_ap."updated_at" as updated_at
        ,form."id" as form_id
        ,form."name" as form_name
        ,form."type" as form_type
        ,form."system" as form_system
      FROM
        "FormApplication" form_ap
      LEFT JOIN
        "Form" form ON form.id = form_ap."form_id"
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalFormsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total FROM "FormApplication" form_ap
      ${gerWhereRawPrisma(whereParams)};
    `;

    const distinctFiltersPromise = this.prisma.$queryRaw<IFormApplicationBrowseFilterModelMapper[]>`
      SELECT
        array_agg(DISTINCT form.type) AS filter_types
      FROM
        "Form" form
      LEFT JOIN
        "FormApplication" form_ap ON form_ap."form_id" = form.id
      ${gerWhereRawPrisma(browseWhereParams)};
    `;

    const [forms, totalForms, distinctFilters] = await Promise.all([formsPromise, totalFormsPromise, distinctFiltersPromise]);

    // Get aggregated data for each form application separately
    const formsWithAggregatedData = await this.addAggregatedDataToForms(forms);

    return FormApplicationBrowseModelMapper.toModel({
      results: formsWithAggregatedData,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalForms[0].total) },
      filters: distinctFilters[0],
    });
  }

  private browseWhere(filters: IFormApplicationDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`form_ap."deleted_at" IS NULL`,
      Prisma.sql`(
        form_ap."company_id" = ${filters.companyId}
        OR EXISTS (
          SELECT 1
          FROM "FormApplicationCompany" fac
          WHERE fac."form_application_id" = form_ap."id"
            AND fac."company_id" = ${filters.companyId}
        )
      )`,
    ];

    return where;
  }

  private filterWhere(filters: IFormApplicationDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`unaccent(lower(form_ap.name)) ILIKE unaccent(lower(${search}))`);
    }

    if (filters.status?.length) {
      const status = filters.status.map((type) => type.toLowerCase());
      where.push(Prisma.sql`lower(form_ap.status) = ANY(${status})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IFormApplicationDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];
    const desiredOrder = [FormStatusEnum.INACTIVE, FormStatusEnum.PENDING, FormStatusEnum.PROGRESS, FormStatusEnum.DONE, FormStatusEnum.CANCELED];

    const map: Record<FormApplicationOrderByEnum, string> = {
      [FormApplicationOrderByEnum.NAME]: 'form_ap.name',
      [FormApplicationOrderByEnum.STATUS]: `
      CASE form_ap.status 
        ${desiredOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} 
        ELSE ${desiredOrder.findIndex((type) => type === FormStatusEnum.PENDING)} 
      END
    `,
      [FormApplicationOrderByEnum.END_DATE]: 'form_ap.ended_at',
      [FormApplicationOrderByEnum.START_DATE]: 'form_ap.started_at',
      [FormApplicationOrderByEnum.CREATED_AT]: 'form_ap.created_at',
      [FormApplicationOrderByEnum.UPDATED_AT]: 'form_ap.updated_at',
      [FormApplicationOrderByEnum.DESCRIPTION]: 'form_ap.description',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }

  private async addAggregatedDataToForms(
    forms: Omit<IFormApplicationBrowseResultModelMapper, 'total_answers' | 'total_participants' | 'average_time_spent'>[],
  ): Promise<IFormApplicationBrowseResultModelMapper[]> {
    if (forms.length === 0) return [];

    const formApplicationIds = forms.map((form) => form.id);

    // Get answers count and average time spent for all form applications
    const answersDataPromise = this.prisma.$queryRaw<{ form_application_id: string; total_answers: number; average_time_spent: number | null }[]>`
      SELECT
        form_application_id,
        COUNT(*)::integer as total_answers,
        AVG(time_spent)::integer as average_time_spent
      FROM "FormParticipantsAnswers"
      WHERE form_application_id = ANY(${formApplicationIds})
        AND status = 'VALID'
      GROUP BY form_application_id;
    `;

    // Get participants count for all form applications - optimized approach
    const participantsDataPromise = this.getParticipantsCountOptimized(formApplicationIds);

    const [answersData, participantsData] = await Promise.all([answersDataPromise, participantsDataPromise]);

    // Create lookup maps for efficient data retrieval
    const answersMap = new Map(answersData.map((item) => [item.form_application_id, item]));
    const participantsMap = new Map(participantsData.map((item) => [item.form_application_id, item]));

    // Combine the data
    return forms.map((form) => {
      const answers = answersMap.get(form.id);
      const participants = participantsMap.get(form.id);

      return {
        ...form,
        total_answers: answers?.total_answers || 0,
        total_participants: participants?.total_participants || 0,
        average_time_spent: answers?.average_time_spent || null,
      };
    });
  }

  private async getParticipantsCountOptimized(
    formApplicationIds: string[],
  ): Promise<{ form_application_id: string; total_participants: number }[]> {
    if (formApplicationIds.length === 0) return [];

    const applications = await this.prisma.formApplication.findMany({
      where: { id: { in: formApplicationIds }, deleted_at: null },
      select: {
        id: true,
        scope_type: true,
        company_id: true,
        applicationCompanies: { select: { company_id: true } },
        participants: {
          select: {
            workspaces: { select: { workspace_id: true } },
          },
        },
      },
    });

    const companyScopedApplicationIds: string[] = [];
    const workspaceScopedApplicationIds: string[] = [];

    for (const application of applications) {
      const scope = this.toResolvedScope(application);

      if (
        this.formApplicationScopeService.isBusinessGroupScope(scope) ||
        this.formApplicationScopeService.usesConsolidatedApplicationCompaniesParticipantScope(
          scope,
        )
      ) {
        companyScopedApplicationIds.push(application.id);
        continue;
      }

      workspaceScopedApplicationIds.push(application.id);
    }

    const [companyScopedCounts, workspaceScopedCounts] = await Promise.all([
      this.countParticipantsByCompanyScope(companyScopedApplicationIds, applications),
      workspaceScopedApplicationIds.length > 0
        ? this.countParticipantsByWorkspaceScope(workspaceScopedApplicationIds)
        : Promise.resolve([]),
    ]);

    return [...companyScopedCounts, ...workspaceScopedCounts];
  }

  private toResolvedScope(application: {
    scope_type: string;
    company_id: string;
    applicationCompanies: { company_id: string }[];
    participants: { workspaces: { workspace_id: string }[] } | null;
  }): ResolvedFormApplicationScope {
    const participantWorkspaceIds =
      application.participants?.workspaces.map(
        (workspace) => workspace.workspace_id,
      ) ?? [];

    if (application.scope_type === FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES) {
      const companies = application.applicationCompanies.map((row) => ({
        id: row.company_id,
        name: '',
      }));

      return {
        scopeType: FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES,
        anchorCompanyId: application.company_id,
        companyGroupId: 0,
        participantCompanyIds: companies.map((company) => company.id),
        companies,
        participantWorkspaceIds,
      };
    }

    const convertedCompanyIds = application.applicationCompanies
      .map((row) => row.company_id)
      .filter((companyId) => companyId !== application.company_id);

    return {
      scopeType: FormApplicationScopeTypeEnum.COMPANY_WORKSPACES,
      anchorCompanyId: application.company_id,
      participantCompanyIds: [application.company_id],
      convertedCompanyIds,
      participantWorkspaceIds,
    };
  }

  private async countParticipantsByCompanyScope(
    applicationIds: string[],
    applications: Array<{
      id: string;
      scope_type: string;
      company_id: string;
      applicationCompanies: { company_id: string }[];
      participants: { workspaces: { workspace_id: string }[] } | null;
    }>,
  ): Promise<{ form_application_id: string; total_participants: number }[]> {
    if (applicationIds.length === 0) return [];

    const applicationIdSet = new Set(applicationIds);

    return Promise.all(
      applications
        .filter((application) => applicationIdSet.has(application.id))
        .map(async (application) => {
          const scope = this.toResolvedScope(application);
          const companyIds =
            this.formApplicationScopeService.participantCompanyIdsForScope(scope);

          const totalParticipants = await this.prisma.employee.count({
            where: {
              companyId: { in: companyIds },
              status: 'ACTIVE',
            },
          });

          return {
            form_application_id: application.id,
            total_participants: totalParticipants,
          };
        }),
    );
  }

  private countParticipantsByWorkspaceScope(
    formApplicationIds: string[],
  ): Promise<{ form_application_id: string; total_participants: number }[]> {
    return this.prisma.$queryRaw<{ form_application_id: string; total_participants: number }[]>`
      SELECT
        form_application_id,
        COUNT(DISTINCT employee_id)::integer as total_participants
      FROM (
        SELECT
          form_part.form_application_id,
          emp.id as employee_id
        FROM "FormParticipants" form_part
        INNER JOIN "FormParticipantsHierarchy" form_part_hier ON form_part_hier.form_participants_id = form_part.id
        INNER JOIN "Employee" emp ON emp."hierarchyId" = form_part_hier.hierarchy_id
        WHERE form_part.form_application_id = ANY(${formApplicationIds})
          AND emp.id IS NOT NULL
          AND emp."status" = 'ACTIVE'

        UNION

        SELECT
          form_part.form_application_id,
          emp.id as employee_id
        FROM "FormParticipants" form_part
        INNER JOIN "FormParticipantsWorkspace" form_part_ws ON form_part_ws.form_participants_id = form_part.id
        INNER JOIN "_HierarchyToWorkspace" h_t_w ON h_t_w."B" = form_part_ws.workspace_id
        INNER JOIN "Employee" emp ON emp."hierarchyId" = h_t_w."A"
        WHERE form_part.form_application_id = ANY(${formApplicationIds})
          AND emp.id IS NOT NULL
          AND emp."status" = 'ACTIVE'
      ) combined_participants
      GROUP BY form_application_id;
    `;
  }
}
