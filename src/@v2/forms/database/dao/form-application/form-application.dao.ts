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

@Injectable()
export class FormApplicationDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read(params: IFormApplicationDAO.ReadParams) {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
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

    const totalParticipantsPromise = this.prisma.employee.count({
      where: {
        companyId: params.companyId,
        hierarchy: {
          workspaces: {
            some: {
              id: {
                in: formApplication.participants?.workspaces.map((workspace) => workspace.workspace_id) || [],
              },
            },
          },
        },
      },
    });

    const totalAnswersPromise = this.prisma.formParticipantsAnswers.count({
      where: {
        form_application_id: params.id,
        status: 'VALID',
      },
    });

    const [totalParticipants, totalAnswers] = await Promise.all([totalParticipantsPromise, totalAnswersPromise]);

    return FormApplicationReadModelMapper.toModel({
      ...formApplication,
      totalParticipants,
      totalAnswers,
    });
  }

  async readPublic(params: IFormApplicationDAO.ReadPublicParams) {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: params.id,
      },
      include: {
        form: {
          include: {
            questions_groups: {
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

    const formsPromise = this.prisma.$queryRaw<IFormApplicationBrowseResultModelMapper[]>`
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
        ,COUNT(DISTINCT form_part_ans."id")::integer as total_answers
        ,COUNT(DISTINCT emp."id")::integer as total_participants
      FROM 
        "FormApplication" form_ap
      LEFT JOIN 
        "Form" form ON form.id = form_ap."form_id"
      LEFT JOIN 
        "FormParticipantsAnswers" form_part_ans ON form_part_ans."form_application_id" = form_ap."id" AND form_part_ans.status = 'VALID'
      LEFT JOIN 
        "FormParticipants" form_part ON form_part."form_application_id" = form_ap."id"
      LEFT JOIN 
        "FormParticipantsWorkspace" form_part_ws ON form_part_ws."form_participants_id" = form_part."id"
      LEFT JOIN 
        "_HierarchyToWorkspace" h_t_w ON h_t_w."B" = form_part_ws."workspace_id"
      LEFT JOIN 
        "FormParticipantsHierarchy" form_part_hier ON form_part_hier."form_participants_id" = form_part."id"
      LEFT JOIN 
        "Employee" emp ON (emp."hierarchyId" = form_part_hier."hierarchy_id" OR emp."hierarchyId" = h_t_w."A") 
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY
        form_ap."id"
        ,form_ap."name"
        ,form_ap."description"
        ,form_ap."company_id"
        ,form_ap."status"
        ,form_ap."ended_at"
        ,form_ap."started_at"
        ,form_ap."created_at"
        ,form_ap."updated_at"
        ,form."id"
        ,form."name"
        ,form."type"
        ,form."system"
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

    return FormApplicationBrowseModelMapper.toModel({
      results: forms,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalForms[0].total) },
      filters: distinctFilters[0],
    });
  }

  private browseWhere(filters: IFormApplicationDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`form_ap."company_id" = ${filters.companyId}`, Prisma.sql`form_ap."deleted_at" IS NULL`];

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
}
