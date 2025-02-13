import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DocumentControlFileReadModelMapper } from '../../mappers/models/document-control-file/document-control-read.mapper';
import { IDocumentControlBrowseFilterModelMapper } from '../../mappers/models/document-control/document-control-browse-filter.mapper';
import { IDocumentControlBrowseResultModelMapper } from '../../mappers/models/document-control/document-control-browse-result.mapper';
import { DocumentControlBrowseModelMapper } from '../../mappers/models/document-control/document-control-browse.mapper';
import { DocumentControlReadModelMapper, IDocumentControlReadModelMapper } from '../../mappers/models/document-control/document-control-read.mapper';
import { DocumentControlOrderByEnum, IDocumentControlDAO } from './document-control.types';

@Injectable()
export class DocumentControlDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read(params: IDocumentControlDAO.ReadParams) {
    const documentControl = await this.prisma.$queryRaw<IDocumentControlReadModelMapper>`
      SELECT
        document_control."id" as id
        ,document_control."name" as name
        ,document_control."type" as type
        ,document_control."description" as description
        ,document_control."created_at" as created_at
        ,document_control."updated_at" as updated_at
        ,COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'name', document_control_file.name 
            ,'end_date', document_control_file."end_date"
            ,'start_date', document_control_file."start_date"
            ,'file_url', system_file.url
            ,'file_bucket', system_file.bucket
            ,'file_key', system_file.key
            ,'file_name', system_file.name
          )) 
          FILTER (WHERE document_control_file.name IS NOT NULL), '[]'
        ) AS files
      FROM
        "DocumentControl" document_control
      LEFT JOIN 
        "DocumentControlFile" document_control_file ON document_control_file."document_control_id" = document_control."id"
      LEFT JOIN 
        "SystemFile" system_file ON system_file."id" = document_control_file.file_id
      WHERE 
        document_control."id" = ${params.id}
        AND document_control."company_id" = ${params.companyId}
        AND document_control."deleted_at" IS NULL
      GROUP BY 
        document_control."id"
        ,document_control."name"
        ,document_control."type"
        ,document_control."description"
        ,document_control."created_at"
        ,document_control."updated_at"
    `;

    return documentControl[0]?.id ? DocumentControlReadModelMapper.toModel(documentControl[0]) : null;
  }

  async browse({ limit, page, orderBy, filters }: IDocumentControlDAO.BrowseParams) {
    const pagination = getPagination(page, limit);

    const browseWhereParams = this.browseWhere(filters);
    const filterWhereParams = this.filterWhere(filters);
    const orderByParams = this.browseOrderBy(orderBy);

    const whereParams = [...browseWhereParams, ...filterWhereParams];

    const DocumentControlsPromise = this.prisma.$queryRaw<IDocumentControlBrowseResultModelMapper[]>`
      WITH ranked_document AS (
        SELECT
          document_control."id" 
          ,document_control."company_id"
          ,document_control."workspace_id"
          ,document_control."name"
          ,document_control."type"
          ,document_control."description"
          ,document_control."created_at" 
          ,document_control."updated_at"
          ,document_control."deleted_at"
          ,document_control_file."end_date"
          ,document_control_file."start_date"
          ,document_control_file."file_id"
          ,ROW_NUMBER() OVER (PARTITION BY document_control_file."document_control_id" ORDER BY document_control_file."created_at" DESC) as row_num
        FROM
          "DocumentControl" document_control
        LEFT JOIN 
          "DocumentControlFile" document_control_file ON document_control_file."document_control_id" = document_control."id"
      )
      SELECT 
        ranked_document.id 
        ,ranked_document.name
        ,ranked_document.type
        ,ranked_document.description
        ,ranked_document.created_at 
        ,ranked_document.updated_at
        ,ranked_document.end_date
        ,ranked_document.start_date
        ,CASE 
          WHEN system_file.key IS NULL THEN NULL
          ELSE JSONB_BUILD_OBJECT(
            'url', system_file.url,
            'name', system_file.name,
            'key', system_file.key,
            'bucket', system_file.bucket
          ) 
        END AS file
      FROM 
        "ranked_document"
      LEFT JOIN 
        "SystemFile" system_file ON system_file."id" = ranked_document.file_id
      ${gerWhereRawPrisma([...whereParams, Prisma.sql`row_num = 1 OR system_file.key IS NULL`])}
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalDocumentControlsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total FROM "DocumentControl" ranked_document
      ${gerWhereRawPrisma(whereParams)};
    `;

    const distinctFiltersPromise = this.prisma.$queryRaw<IDocumentControlBrowseFilterModelMapper[]>`
      SELECT 
        array_agg(DISTINCT ranked_document.type) AS filter_types
      FROM "DocumentControl" ranked_document
      ${gerWhereRawPrisma(browseWhereParams)};
    `;

    const [DocumentControls, totalDocumentControls, distinctFilters] = await Promise.all([DocumentControlsPromise, totalDocumentControlsPromise, distinctFiltersPromise]);

    return DocumentControlBrowseModelMapper.toModel({
      results: DocumentControls,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalDocumentControls[0].total) },
      filters: distinctFilters[0],
    });
  }

  private browseWhere(filters: IDocumentControlDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`ranked_document."company_id" = ${filters.companyId}`,
      Prisma.sql`ranked_document."workspace_id" = ${filters.workspaceId}`,
      Prisma.sql`ranked_document."deleted_at" IS NULL`,
    ];

    return where;
  }

  private filterWhere(filters: IDocumentControlDAO.BrowseParams['filters']) {
    const where: Prisma.Sql[] = [];

    if (filters.search) {
      const search = `%${filters.search}%`;
      where.push(Prisma.sql`unaccent(lower(ranked_document.name)) ILIKE unaccent(lower(${search}))`);
    }

    if (filters.types?.length) {
      const types = filters.types.map((type) => type.toLowerCase());
      where.push(Prisma.sql`lower(ranked_document.type) = ANY(${types})`);
    }

    return where;
  }

  private browseOrderBy(orderBy?: IDocumentControlDAO.BrowseParams['orderBy']) {
    if (!orderBy) return [];

    const map: Record<DocumentControlOrderByEnum, string> = {
      [DocumentControlOrderByEnum.NAME]: 'ranked_document.name',
      [DocumentControlOrderByEnum.TYPE]: 'ranked_document.type',
      [DocumentControlOrderByEnum.CREATED_AT]: 'ranked_document.created_at',
      [DocumentControlOrderByEnum.UPDATED_AT]: 'ranked_document.updated_at',
      [DocumentControlOrderByEnum.DESCRIPTION]: 'ranked_document.description',
      [DocumentControlOrderByEnum.END_DATE]: 'ranked_document.end_date',
      [DocumentControlOrderByEnum.START_DATE]: 'ranked_document.start_date',
    };

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }));

    console.log(orderByRaw);

    return orderByRaw;
  }
}
