import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFormBrowseFilterModelMapper } from '../../mappers/models/form/form-browse-filter.mapper';
import { IFormBrowseResultModelMapper } from '../../mappers/models/form/form-browse-result.mapper';
import { FormBrowseModelMapper } from '../../mappers/models/form/form-browse.mapper';
import { FormReadModelMapper, IFormReadModelMapper } from '../../mappers/models/form/form-read.mapper';
import { FormOrderByEnum, IFormDAO } from './form.types';

@Injectable()
export class FormDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read(params: IFormDAO.ReadParams) {
    const form = await this.prisma.form.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            company_id: params.companyId,
          },
          {
            system: true,
          },
        ],
        deleted_at: null,
      },
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
    });

    return form ? FormReadModelMapper.toModel(form) : null;
  }

  async browse({ limit, page, orderBy, filters }: IFormDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const formsPromise = this.prisma.$queryRaw<IFormBrowseResultModelMapper[]>`
      SELECT 
        form."id" as id
        ,form."company_id" as company_id
        ,form."name" as name
        ,form."type" as type
        ,form."anonymous" as anonymous
        ,form."system" as system
        ,form."shareable_link" as shareable_link
        ,form."description" as description
        ,form."created_at" as created_at
        ,form."updated_at" as updated_at
      FROM 
        "Form" form
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalFormsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total FROM "Form" form
      ${gerWhereRawPrisma(whereParams)};
    `;

    const distinctFiltersPromise = this.prisma.$queryRaw<IFormBrowseFilterModelMapper[]>`
      SELECT 
        array_agg(DISTINCT form.type) AS filter_types
      FROM "Form" form
      ${gerWhereRawPrisma(browseWhereParams)};
    `;

    const [forms, totalForms, distinctFilters] = await Promise.all([formsPromise, totalFormsPromise, distinctFiltersPromise]);

    return FormBrowseModelMapper.toModel({
      results: forms,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalForms[0].total) },
      filters: distinctFilters[0],
    });
  }

  private browseWhere(filters: IFormDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`form."company_id" = ${filters.companyId} OR form.system = true`, Prisma.sql`form."deleted_at" IS NULL`];

    return where;
  }

  private filterWhere(filters: IFormDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`unaccent(lower(form.name)) ILIKE unaccent(lower(${search}))`);
    }

    if (filters.types?.length) {
      where.push(Prisma.sql`form.type::text = ANY(${filters.types})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IFormDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<FormOrderByEnum, string> = {
      [FormOrderByEnum.NAME]: 'form.name',
      [FormOrderByEnum.TYPE]: 'form.type',
      [FormOrderByEnum.CREATED_AT]: 'form.created_at',
      [FormOrderByEnum.UPDATED_AT]: 'form.updated_at',
      [FormOrderByEnum.DESCRIPTION]: 'form.description',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
