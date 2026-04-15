import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

export type FindByCompanyHomoGroupOptions = {
  companyId: string;
  onlyWithActiveRisks?: boolean;
  riskFactorGroupDataId?: string;
};

@Injectable()
export class FindByCompanyHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(user: UserPayloadDto, options?: FindByCompanyHomoGroupOptions) {
    const companyIdToUse = options?.companyId || user.targetCompanyId;

    const riskWhere: Prisma.RiskFactorDataWhereInput = {
      endDate: null,
      deletedAt: null,
      ...(options?.riskFactorGroupDataId
        ? { riskFactorGroupDataId: options.riskFactorGroupDataId }
        : {}),
    };

    const extraWhere: Prisma.HomogeneousGroupWhereInput =
      options?.onlyWithActiveRisks === true
        ? {
            riskFactorData: {
              some: riskWhere,
            },
          }
        : {};

    const homoGroups = await this.homoGroupRepository.findHomoGroupByCompany(companyIdToUse, {
      where: extraWhere,
      include: {
        hierarchyOnHomogeneous: {
          include: {
            hierarchy: {
              select: {
                id: true,
                companyId: true,
                refName: true,
                parentId: true,
                name: true,
                type: true,
                workspaces: { select: { id: true } },
              },
            },
          },
        },
        characterization: { select: { id: true, name: true, type: true } },
        environment: { select: { id: true, name: true, type: true } },
      },
    });

    return homoGroups;
  }
}
