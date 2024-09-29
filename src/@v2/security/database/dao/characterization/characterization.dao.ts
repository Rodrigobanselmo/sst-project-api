import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { getPagination } from '@/@v2/shared/utils/database/get-pagination';
import { getOrderByRawPrisma, IOrderByRawPrisma } from '@/@v2/shared/utils/database/get-order-by-raw-prisma';
import { Injectable } from '@nestjs/common';
import { CharacterizationBrowseResultModelMapper, ICharacterizationBrowseResultModelMapper } from '../../mappers/mappers/characterization-browse-result.mapper';
import { CharacterizationOrderByEnum, ICharacterizationDAO } from './characterization.types';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { CharacterizationTypeEnum, Prisma, StatusEnum } from '@prisma/client';
import { CharacterizationBrowseModelMapper } from '../../mappers/mappers/characterization-browse.mapper';
import { ICharacterizationBrowseFilterModelMapper } from '../../mappers/mappers/characterization-browse-filter.mapper';


@Injectable()
export class CharacterizationDAO {
  constructor(
    private readonly prisma: PrismaServiceV2,
  ) { }

  async browse({ limit, page, orderBy, filters }: ICharacterizationDAO.BrowseParams) {
    const pagination = getPagination(page, limit)

    const whereParams = this.browseWhere(filters)
    const orderByParams = this.browseOrderBy(orderBy)

    const characterizationsPromise = this.prisma.$queryRaw<ICharacterizationBrowseResultModelMapper[]>`
      SELECT 
        cc.created_at, 
        cc.updated_at, 
        cc.id, 
        cc.name,
        cc.type,
        cc.done_at, 
        cc.order, 
        COUNT(DISTINCT rfd.id) AS total_risks,
        COUNT(DISTINCT profile.id) AS total_profiles,
        COUNT(DISTINCT h.id) AS total_hierarchies,
        COUNT(DISTINCT ph.id) AS total_photos,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', profile.id, 'name', profile."profileName")) 
          FILTER (WHERE profile.id IS NOT NULL), '[]'
        ) AS profiles,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', h.id, 'name', h.name, 'type', h.type)) 
          FILTER (WHERE h.name IS NOT NULL), '[]'
        ) AS hierarchies,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', rf.id, 'name', rf.name)) 
          FILTER (WHERE rf.id IS NOT NULL), '[]'
        ) AS riskFactors,
        COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ph.id, 'url', ph."photoUrl")) 
          FILTER (WHERE ph.id IS NOT NULL), '[]'
        ) AS photos
      FROM 
        "CompanyCharacterization" cc
      LEFT JOIN 
        "HomogeneousGroup" hg ON cc.id = hg.id
      LEFT JOIN 
        "HierarchyOnHomogeneous" hh ON hg.id = hh."homogeneousGroupId" AND hh."endDate" IS NULL
      LEFT JOIN 
        "Hierarchy" h ON hh."hierarchyId" = h.id
      LEFT JOIN 
        "RiskFactorData" rfd ON hg.id = rfd."homogeneousGroupId"
      LEFT JOIN 
        "RiskFactors" rf ON rfd."riskId" = rf.id AND rf."representAll" = false
      LEFT JOIN 
        "CompanyCharacterization" profile ON cc.id = profile."profileParentId"
      LEFT JOIN 
        "CompanyCharacterizationPhoto" ph ON cc.id = ph."companyCharacterizationId"
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        cc.created_at, cc.updated_at, cc.id, cc.name, cc.type, cc.done_at, cc.order
      ${getOrderByRawPrisma(orderByParams)}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offSet};
    `;

    const totalCharacterizationsPromise = this.prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*) AS total FROM "CompanyCharacterization" cc
      ${gerWhereRawPrisma(whereParams)};
    `;

    const distinctFiltersPromise = this.prisma.$queryRaw<ICharacterizationBrowseFilterModelMapper[]>`
      WITH distinct_types AS (
          SELECT DISTINCT type
          FROM "CompanyCharacterization" cc 
          ${gerWhereRawPrisma(whereParams)}
      )
      SELECT 
          (SELECT array_agg(type) FROM distinct_types) AS filter_types;
    `;

    const [characterizations, totalCharacterizations, distinctFilters] = await Promise.all([characterizationsPromise, totalCharacterizationsPromise, distinctFiltersPromise])

    return CharacterizationBrowseModelMapper.toModel({
      results: characterizations,
      pagination: { limit: pagination.limit, page: pagination.page, total: Number(totalCharacterizations[0].total) },
      filters: distinctFilters[0],
    })
  }

  private browseWhere(filters: ICharacterizationDAO.BrowseParams['filters']) {
    const where = [
      Prisma.sql`cc."companyId" = ${filters.companyId}`,
      Prisma.sql`cc."workspaceId" = ${filters.workspaceId}`,
      Prisma.sql`cc."status"::text = ${StatusEnum.ACTIVE}`,
      Prisma.sql`cc."profileParentId" IS NULL`,
    ]


    if (filters.search) {
      const search = `%${filters.search}%`
      where.push(Prisma.sql`unaccent(lower(cc.name)) ILIKE unaccent(lower(${search}))`)
    }

    return where
  }

  private browseOrderBy(orderBy?: ICharacterizationDAO.BrowseParams['orderBy']) {
    if (!orderBy) return []

    const desiredOrder = [CharacterizationTypeEnum.GENERAL, CharacterizationTypeEnum.ADMINISTRATIVE, CharacterizationTypeEnum.OPERATION, CharacterizationTypeEnum.SUPPORT, CharacterizationTypeEnum.WORKSTATION, CharacterizationTypeEnum.ACTIVITIES, CharacterizationTypeEnum.EQUIPMENT]

    const map: Record<CharacterizationOrderByEnum, string> = {
      [CharacterizationOrderByEnum.NAME]: 'cc.name',
      [CharacterizationOrderByEnum.TYPE]: `CASE cc.type ${desiredOrder.map((type, index) => `WHEN '${type}' THEN ${index}`).join(' ')} ELSE ${desiredOrder.length} END`,
      [CharacterizationOrderByEnum.CREATED_AT]: 'cc.created_at',
      [CharacterizationOrderByEnum.UPDATED_AT]: 'cc.updated_at',
      [CharacterizationOrderByEnum.DONE_AT]: 'cc.done_at',
      [CharacterizationOrderByEnum.ORDER]: 'cc.order',
      [CharacterizationOrderByEnum.PHOTOS]: 'total_photos',
      [CharacterizationOrderByEnum.RISKS]: 'total_risks',
      [CharacterizationOrderByEnum.HIERARCHY]: 'total_hierarchies',
      [CharacterizationOrderByEnum.PROFILES]: 'total_profiles',
    }

    const orderByRaw = orderBy.map<IOrderByRawPrisma>(({ field, order }) => ({ column: map[field], order }))

    return orderByRaw
  }
}
