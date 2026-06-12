import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

export type AccessibleGroupCompaniesResult = {
  companyGroupId: number;
  companyGroupName: string;
  includedCompanyIds: string[];
};

@Injectable()
export class AccessibleGroupCompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveAccessibleGroupMembers(params: {
    companyGroupId: number;
    user: UserPayloadDto;
  }): Promise<AccessibleGroupCompaniesResult> {
    const group = await this.prisma.companyGroup.findUnique({
      where: { id: params.companyGroupId },
      select: {
        id: true,
        name: true,
        companies: {
          where: { deleted_at: null, isGroup: false },
          select: { id: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Grupo empresarial não encontrado');
    }

    const memberIds = group.companies.map((company) => company.id);

    if (memberIds.length === 0) {
      throw new ForbiddenException('Sem permissões para acesso ao grupo empresarial');
    }

    const includedCompanyIds = await this.filterAccessibleCompanyIds({
      memberIds,
      user: params.user,
    });

    if (includedCompanyIds.length === 0) {
      throw new ForbiddenException('Sem permissões para acesso ao grupo empresarial');
    }

    return {
      companyGroupId: group.id,
      companyGroupName: group.name,
      includedCompanyIds,
    };
  }

  private async filterAccessibleCompanyIds(params: {
    memberIds: string[];
    user: UserPayloadDto;
  }): Promise<string[]> {
    const { memberIds, user } = params;

    if (user.isMaster) {
      return memberIds;
    }

    const userCompanyId = user.companyId;

    const accessibleCompanies = await this.prisma.company.findMany({
      where: {
        deleted_at: null,
        isGroup: false,
        id: { in: memberIds },
        OR: [
          { id: userCompanyId },
          {
            receivingServiceContracts: {
              some: {
                applyingServiceCompanyId: userCompanyId,
                status: 'ACTIVE',
              },
            },
          },
          {
            users: { some: { userId: user.userId } },
          },
        ],
      },
      select: { id: true },
    });

    return accessibleCompanies.map((company) => company.id);
  }
}
