import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, RiskRecTextTypeEnum, RiskRecTypeEnum } from '@prisma/client';
import { CommentBrowseFilterModelMapper } from '../../mappers/models/comment/comment-browse-filter.mapper';
import { ICommentBrowseResultModelMapper } from '../../mappers/models/comment/comment-browse-result.mapper';
import { CommentBrowseModelMapper } from '../../mappers/models/comment/comment-browse.mapper';
import { CommentOrderByEnum, ICommentDAO } from './comment.types';

@Injectable()
export class CommentDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ limit, page, orderBy, filters }: ICommentDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const browseFilterParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...browseFilterParams];

    const commentsPromise = this.prisma.$queryRaw<ICommentBrowseResultModelMapper[]>`
      SELECT 
        comment."id" AS comment_id,
        comment."isApproved" AS comment_is_approved,
        comment."approvedAt" AS comment_approved_at,
        comment."approvedComment" AS comment_approved_comment,
        comment."text" AS comment_text,
        comment."type" AS  comment_type,
        comment."textType" AS comment_text_type,
        comment."created_at" AS comment_created_at,
        comment."updated_at" AS comment_updated_at,
        comment."previous_status" AS previous_status,
        comment."previous_valid_date" AS previous_valid_date,
        comment."current_status" AS current_status,
        comment."current_valid_date" AS current_valid_date,
        rec."recName" AS rec_name,
        hg."type" AS hg_type,
        hg."id" AS hg_id,
        hg."name" AS hg_name,
        cc."id" AS cc_id,
        cc."name" AS cc_name,
        cc."type" AS cc_type,
        (array_agg(h."type"))[1] AS h_type,
        (array_agg(h."name"))[1] AS h_name,
        creator_user."name" AS creator_name,
        creator_user."email" AS creator_email,
        creator_user."id" AS creator_id,
        approved_user."name" AS approved_name,
        approved_user."email" AS approved_email,
        approved_user."id" AS approved_id
      FROM 
        "RiskFactorDataRecComments" comment
      LEFT JOIN
        "User" creator_user ON creator_user."id" = comment."userId"
      LEFT JOIN
        "User" approved_user ON approved_user."id" = comment."approvedById"
      LEFT JOIN
        "RiskFactorDataRec" rfs_rec ON rfs_rec."id" = comment."riskFactorDataRecId"
      LEFT JOIN
        "RecMed" rec ON rec."id" = rfs_rec."recMedId"
      LEFT JOIN
        "RiskFactorData" rfd ON rfd."id" = rfs_rec."riskFactorDataId"
      LEFT JOIN
        "HomogeneousGroup" hg ON hg."id" = rfd."homogeneousGroupId"
      LEFT JOIN
        "HierarchyOnHomogeneous" hh ON hh."homogeneousGroupId" = hg."id" AND hh."endDate" IS NULL
      LEFT JOIN 
        "Hierarchy" h ON h."id" = hh."hierarchyId"
      LEFT JOIN
        "CompanyCharacterization" cc ON cc."id" = hg."id"
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        comment."id",
        comment."isApproved",
        comment."approvedAt",
        comment."approvedComment",
        comment."text",
        comment."type",
        comment."textType",
        comment."created_at",
        comment."updated_at",
        comment."previous_status",
        comment."previous_valid_date",
        comment."current_status",
        comment."current_valid_date",
        rec."recName",
        hg."type",
        hg."id",
        hg."name",
        cc."id",
        cc."name",
        cc."type",
        creator_user."name",
        creator_user."email",
        creator_user."id",
        approved_user."name",
        approved_user."email",
        approved_user."id"
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalCommentsPromise = this.prisma.$queryRaw<[{ total: number } & CommentBrowseFilterModelMapper]>`
      SELECT 
        COUNT(*)::integer AS total
      FROM 
        "RiskFactorDataRecComments" comment
      LEFT JOIN
        "User" creator_user ON creator_user."id" = comment."userId"
      LEFT JOIN
        "User" approved_user ON approved_user."id" = comment."approvedById"
      LEFT JOIN
        "RiskFactorDataRec" rfs_rec ON rfs_rec."id" = comment."riskFactorDataRecId"
      ${gerWhereRawPrisma(whereParams)}
    `;

    const [comments, totalComments] = await Promise.all([commentsPromise, totalCommentsPromise]);

    return CommentBrowseModelMapper.toModel({
      results: comments,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalComments[0].total) },
      filters: totalComments[0],
    });
  }

  private browseWhere(filters: ICommentDAO.BrowseParams['filters']) {
    const where = [Prisma.sql`rfs_rec."companyId" = ${filters.companyId}`, Prisma.sql`comment."type" <> 'PROGRESS'`];

    return where;
  }

  private filterWhere(filters: ICommentDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`
        unaccent(lower(comment."text")) ILIKE unaccent(lower(${search}))
      `);
    }

    if (filters.workspaceIds?.length) {
      where.push(Prisma.sql`rfs_rec."workspaceId" IN (${Prisma.join(filters.workspaceIds)})`);
    }

    if (filters.creatorsIds?.length) {
      where.push(Prisma.sql`creator_user."id" IN (${Prisma.join(filters.creatorsIds)})`);
    }

    if (filters.type?.length) {
      where.push(Prisma.sql`comment."type"::text IN (${Prisma.join(filters.type)})`);
    }

    if (filters.textType?.length) {
      where.push(Prisma.sql`comment."textType"::text IN (${Prisma.join(filters.textType)})`);
    }

    if (typeof filters.isApproved === 'boolean') {
      where.push(Prisma.sql`comment."isApproved" = ${filters.isApproved}`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: ICommentDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const desiredTypeOrder = [RiskRecTypeEnum.POSTPONED, RiskRecTypeEnum.DONE, RiskRecTypeEnum.CANCELED];
    const desiredTextTypeOrder = [RiskRecTextTypeEnum.MONEY, RiskRecTextTypeEnum.LOGISTICS, RiskRecTextTypeEnum.TECHNIQUE, RiskRecTextTypeEnum.OTHER];

    const map: Record<CommentOrderByEnum, string> = {
      [CommentOrderByEnum.UPDATED_AT]: 'comment."updated_at"',
      [CommentOrderByEnum.CREATED_AT]: 'comment."created_at"',
      [CommentOrderByEnum.APPROVED_BY]: 'approved_user."name"',
      [CommentOrderByEnum.CREATOR]: 'creator_user."name"',
      [CommentOrderByEnum.TYPE]: `CASE comment."type" ${desiredTypeOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} ELSE ${desiredTypeOrder.length} END`,
      [CommentOrderByEnum.TEXT_TYPE]: `CASE comment."textType" ${desiredTextTypeOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} ELSE ${desiredTextTypeOrder.length} END`,
      [CommentOrderByEnum.IS_APPROVED]: `
        CASE
          WHEN comment."isApproved" IS NULL THEN 0
          WHEN comment."isApproved" = TRUE THEN 1
          ELSE 2
        END
      `,
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    return orderByRaw;
  }
}
