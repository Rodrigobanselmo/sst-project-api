import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IOriginDAO } from './origin.types';
import { OriginMapper } from '../../mappers/models/origin/origin.mapper';

@Injectable()
export class OriginDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const select = {
      id: true,
      name: true,
      type: true,
      companyId: true,
      hierarchyOnHomogeneous: {
        select: {
          hierarchy: {
            select: {
              name: true,
              type: true,
            },
          },
        },
      },
      characterization: {
        select: {
          name: true,
          type: true,
          photos: true,
        },
      },
    } satisfies Prisma.HomogeneousGroupFindFirstArgs['select'];

    return { select };
  }

  async find(params: IOriginDAO.FindParams) {
    const homogeneousGroupPromise = this.prisma.homogeneousGroup.findFirst({
      where: {
        id: params.id,
        companyId: params.companyId,
      },
      ...OriginDAO.selectOptions(),
    });

    const photosPromise = this.prisma.riskFactorDataRecPhoto.findMany({
      where: {
        risk_data_rec: {
          workspaceId: params.workspaceId,
          companyId: params.companyId,
          recMedId: params.recommendationId,
          riskFactorData: {
            homogeneousGroupId: params.id,
          },
        },
      },
    });

    const [homogeneousGroup, photos] = await Promise.all([homogeneousGroupPromise, photosPromise]);

    return OriginMapper.toModel({ homogeneousGroup, photos });
  }
}
