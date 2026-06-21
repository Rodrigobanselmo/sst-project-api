import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

export type BusinessGroupContext = {
  companyGroupId: number;
  memberIds: string[];
};

export type ValidateGroupCompaniesParams = {
  baseCompanyId: string;
  requestedCompanyIds?: string[];
  operatorUserId: number;
  operatorCompanyId: string;
  isMaster: boolean;
};

export type ValidateGroupCompaniesResult = {
  validatedCompanyIds: string[];
  groupContext: BusinessGroupContext;
};

@Injectable()
export class BusinessGroupUserScopeService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveGroupContext(baseCompanyId: string): Promise<BusinessGroupContext | null> {
    const company = await this.prisma.company.findFirst({
      where: { id: baseCompanyId, deleted_at: null },
      select: {
        groupId: true,
        group: {
          select: {
            id: true,
            companies: {
              where: { deleted_at: null, isGroup: false },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!company?.groupId || !company.group) {
      return null;
    }

    const memberIds = company.group.companies.map((member) => member.id);

    if (!memberIds.length) {
      return null;
    }

    return {
      companyGroupId: company.group.id,
      memberIds,
    };
  }

  async filterOperatorAssignableCompanyIds(params: {
    memberIds: string[];
    operatorUserId: number;
    operatorCompanyId: string;
    isMaster: boolean;
  }): Promise<string[]> {
    const { memberIds, operatorUserId, operatorCompanyId, isMaster } = params;

    if (isMaster) {
      return memberIds;
    }

    const accessibleCompanies = await this.prisma.company.findMany({
      where: {
        deleted_at: null,
        isGroup: false,
        id: { in: memberIds },
        OR: [
          { id: operatorCompanyId },
          {
            receivingServiceContracts: {
              some: {
                applyingServiceCompanyId: operatorCompanyId,
                status: 'ACTIVE',
              },
            },
          },
          {
            users: { some: { userId: operatorUserId } },
          },
        ],
      },
      select: { id: true },
    });

    return accessibleCompanies.map((company) => company.id);
  }

  async validateRequestedCompanyIds(
    params: ValidateGroupCompaniesParams,
  ): Promise<ValidateGroupCompaniesResult> {
    const groupContext = await this.resolveGroupContext(params.baseCompanyId);

    if (!groupContext) {
      throw new BadRequestException(
        'Escopo multiempresa por grupo só é permitido para empresas vinculadas a um grupo empresarial',
      );
    }

    if (!groupContext.memberIds.includes(params.baseCompanyId)) {
      throw new BadRequestException('Empresa base não pertence ao grupo empresarial informado');
    }

    const requestedCompanyIds = [...new Set(params.requestedCompanyIds ?? [])];

    if (!requestedCompanyIds.length) {
      throw new BadRequestException('Informe ao menos uma empresa do grupo empresarial');
    }

    const outsideGroup = requestedCompanyIds.filter((id) => !groupContext.memberIds.includes(id));

    if (outsideGroup.length) {
      throw new BadRequestException(
        `Empresa(s) não pertence(m) ao grupo empresarial: ${outsideGroup.join(', ')}`,
      );
    }

    const assignableCompanyIds = await this.filterOperatorAssignableCompanyIds({
      memberIds: groupContext.memberIds,
      operatorUserId: params.operatorUserId,
      operatorCompanyId: params.operatorCompanyId,
      isMaster: params.isMaster,
    });

    const notAssignable = requestedCompanyIds.filter((id) => !assignableCompanyIds.includes(id));

    if (notAssignable.length) {
      throw new ForbiddenException(
        `Sem permissão para conceder acesso à(s) empresa(s): ${notAssignable.join(', ')}`,
      );
    }

    const companiesRows = await this.prisma.company.findMany({
      where: {
        id: { in: requestedCompanyIds },
        deleted_at: null,
      },
      select: { id: true },
    });

    const existingIds = new Set(companiesRows.map((row) => row.id));
    const missingCompanyIds = requestedCompanyIds.filter((id) => !existingIds.has(id));

    if (missingCompanyIds.length) {
      throw new BadRequestException(
        `Empresa(s) inválida(s) ou inexistente(s): ${missingCompanyIds.join(', ')}`,
      );
    }

    return {
      validatedCompanyIds: requestedCompanyIds,
      groupContext,
    };
  }

  async validateFromUserPayload(
    params: Omit<ValidateGroupCompaniesParams, 'operatorUserId' | 'operatorCompanyId' | 'isMaster'> & {
      user: UserPayloadDto;
    },
  ): Promise<ValidateGroupCompaniesResult> {
    const operatorCompanyId = params.user.targetCompanyId ?? params.user.companyId ?? params.baseCompanyId;

    return this.validateRequestedCompanyIds({
      baseCompanyId: params.baseCompanyId,
      requestedCompanyIds: params.requestedCompanyIds,
      operatorUserId: params.user.userId,
      operatorCompanyId,
      isMaster: params.user.isMaster,
    });
  }
}
