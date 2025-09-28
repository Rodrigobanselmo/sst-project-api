import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { FormParticipantsOrderByEnum } from '@/@v2/forms/application/form-participants/browse-form-participants/controllers/browse-form-participants.query';
import { IFormParticipantsDAO } from './form-participants.types';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { IFormParticipantsBrowseResultModelMapper } from '../../mappers/models/form-participants/form-participants-browse-result.mapper';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { FormParticipantsBrowseModelMapper } from '../../mappers/models/form-participants/form-participants-browse.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class FormParticipantsDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters, cryptoAdapter }: IFormParticipantsDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const participantsPromise = this.prisma.$queryRaw<IFormParticipantsBrowseResultModelMapper[]>`
      SELECT DISTINCT
        emp."id" as id
        ,emp."name" as name
        ,emp."cpf" as cpf
        ,emp."email" as email
        ,emp."phone" as phone
        ,emp."status" as status
        ,emp."companyId" as company_id
        ,emp."hierarchyId" as hierarchy_id
        ,hier."name" as hierarchy_name
        ,hier."type" as hierarchy_type
        ,h_parent_1."id" as h_parent_1_id
        ,h_parent_1."name" as h_parent_1_name
        ,h_parent_1."type" as h_parent_1_type
        ,h_parent_2."id" as h_parent_2_id
        ,h_parent_2."name" as h_parent_2_name
        ,h_parent_2."type" as h_parent_2_type
        ,h_parent_3."id" as h_parent_3_id
        ,h_parent_3."name" as h_parent_3_name
        ,h_parent_3."type" as h_parent_3_type
        ,h_parent_4."id" as h_parent_4_id
        ,h_parent_4."name" as h_parent_4_name
        ,h_parent_4."type" as h_parent_4_type
        ,h_parent_5."id" as h_parent_5_id
        ,h_parent_5."name" as h_parent_5_name
        ,h_parent_5."type" as h_parent_5_type
        ,CASE WHEN form_answers."id" IS NOT NULL THEN true ELSE false END as has_responded
        ,(
          SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
          FROM "EmailLog" el
          WHERE el."deduplicationId" = CONCAT('FORM_INVITATION:', emp."id", ':', ${filters.applicationId})
          AND el."template" = 'FORM_INVITATION'
        ) as email_sent
        ,(
          SELECT el."created_at"
          FROM "EmailLog" el
          WHERE el."deduplicationId" = CONCAT('FORM_INVITATION:', emp."id", ':', ${filters.applicationId})
          AND el."template" = 'FORM_INVITATION'
          ORDER BY el."created_at" DESC
          LIMIT 1
        ) as email_sent_at
        ,COALESCE(h_parent_5."name", h_parent_4."name", h_parent_3."name", h_parent_2."name", h_parent_1."name", hier."name") as hierarchy_sort_name
        ,emp."created_at" as created_at
        ,emp."updated_at" as updated_at
      FROM
        "Employee" emp
      LEFT JOIN
        "Hierarchy" hier ON hier."id" = emp."hierarchyId"
      LEFT JOIN
        "Hierarchy" h_parent_1 ON h_parent_1."id" = hier."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_5 ON h_parent_5."id" = h_parent_4."parentId"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w ON h_t_w."A" = emp."hierarchyId"
      LEFT JOIN
        "FormApplication" form_ap ON form_ap."id" = ${filters.applicationId}
      LEFT JOIN
        "FormParticipants" form_part ON form_part."form_application_id" = form_ap."id"
      LEFT JOIN
        "FormParticipantsWorkspace" form_part_ws ON form_part_ws."form_participants_id" = form_part."id"
      LEFT JOIN
        "FormParticipantsHierarchy" form_part_hier ON form_part_hier."form_participants_id" = form_part."id"
      LEFT JOIN
        "FormParticipantsAnswers" form_answers ON form_answers."form_application_id" = ${filters.applicationId}
        AND form_answers."employee_id" = emp."id"
        AND form_answers."status" IN ('VALID')
      ${gerWhereRawPrisma(whereParams)}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalParticipantsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(DISTINCT emp."id") AS total
      FROM
        "Employee" emp
      LEFT JOIN
        "Hierarchy" hier ON hier."id" = emp."hierarchyId"
      LEFT JOIN
        "Hierarchy" h_parent_1 ON h_parent_1."id" = hier."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_2 ON h_parent_2."id" = h_parent_1."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_3 ON h_parent_3."id" = h_parent_2."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_4 ON h_parent_4."id" = h_parent_3."parentId"
      LEFT JOIN
        "Hierarchy" h_parent_5 ON h_parent_5."id" = h_parent_4."parentId"
      LEFT JOIN
        "_HierarchyToWorkspace" h_t_w ON h_t_w."A" = emp."hierarchyId"
      LEFT JOIN
        "FormApplication" form_ap ON form_ap."id" = ${filters.applicationId}
      LEFT JOIN
        "FormParticipants" form_part ON form_part."form_application_id" = form_ap."id"
      LEFT JOIN
        "FormParticipantsWorkspace" form_part_ws ON form_part_ws."form_participants_id" = form_part."id"
      LEFT JOIN
        "FormParticipantsHierarchy" form_part_hier ON form_part_hier."form_participants_id" = form_part."id"
      ${gerWhereRawPrisma(whereParams)};
    `;

    const [participants, totalParticipants] = await Promise.all([participantsPromise, totalParticipantsPromise]);

    return FormParticipantsBrowseModelMapper.toModel({
      results: participants,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalParticipants[0].total) },
      cryptoAdapter,
    });
  }

  private browseWhere(filters: IFormParticipantsDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`emp."companyId" = ${filters.companyId}`,
      Prisma.sql`emp."status" = 'ACTIVE'`,
      Prisma.sql`(
        emp."hierarchyId" = form_part_hier."hierarchy_id"
        OR emp."hierarchyId" = h_t_w."A" AND h_t_w."B" = form_part_ws."workspace_id"
      )`,
    ];

    // Add email filter if requested
    if (filters.onlyWithEmail) {
      where.push(Prisma.sql`emp."email" IS NOT NULL AND emp."email" != ''`);
    }

    // Filter by hierarchy IDs if provided (including parent hierarchies)
    if (filters.hierarchyIds && filters.hierarchyIds.length > 0) {
      where.push(Prisma.sql`(
        emp."hierarchyId" IN (${Prisma.join(filters.hierarchyIds)})
        OR hier."id" IN (${Prisma.join(filters.hierarchyIds)})
        OR h_parent_1."id" IN (${Prisma.join(filters.hierarchyIds)})
        OR h_parent_2."id" IN (${Prisma.join(filters.hierarchyIds)})
        OR h_parent_3."id" IN (${Prisma.join(filters.hierarchyIds)})
        OR h_parent_4."id" IN (${Prisma.join(filters.hierarchyIds)})
        OR h_parent_5."id" IN (${Prisma.join(filters.hierarchyIds)})
      )`);
    }

    return where;
  }

  private filterWhere(filters: IFormParticipantsDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`(
        unaccent(lower(emp.name)) ILIKE unaccent(lower(${search}))
        OR emp.cpf ILIKE ${search}
        OR unaccent(lower(emp.email)) ILIKE unaccent(lower(${search}))
        OR emp.phone ILIKE ${search}
      )`);
    }

    if (filters.participantIds && filters.participantIds.length > 0) {
      where.push(Prisma.sql`emp."id" IN (${Prisma.join(filters.participantIds)})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IFormParticipantsDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<FormParticipantsOrderByEnum, string> = {
      [FormParticipantsOrderByEnum.NAME]: 'emp.name',
      [FormParticipantsOrderByEnum.CPF]: 'emp.cpf',
      [FormParticipantsOrderByEnum.EMAIL]: 'emp.email',
      [FormParticipantsOrderByEnum.PHONE]: 'emp.phone',
      [FormParticipantsOrderByEnum.HIERARCHY]: 'hierarchy_sort_name',
      [FormParticipantsOrderByEnum.STATUS]: 'emp.status',
      [FormParticipantsOrderByEnum.CREATED_AT]: 'emp.created_at',
      [FormParticipantsOrderByEnum.HAS_RESPONDED]: 'has_responded',
      [FormParticipantsOrderByEnum.EMAIL_SENT]: 'email_sent',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
