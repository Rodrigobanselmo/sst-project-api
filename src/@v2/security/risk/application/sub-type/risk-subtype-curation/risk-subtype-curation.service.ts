import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

import {
  BulkAssignRiskSubtypeBody,
  BulkClearRiskSubtypeBody,
  BrowseRiskSubtypeCurationRisksQuery,
} from './risk-subtype-curation.dto';
import { RiskSubtypeCurationRepository } from './risk-subtype-curation.repository';
import {
  RiskSubtypeBulkAssignModeEnum,
  RiskSubtypeBulkResult,
  RiskSubtypeCurationFilterEnum,
} from './risk-subtype-curation.types';

@Injectable()
export class RiskSubtypeCurationService {
  constructor(private readonly repository: RiskSubtypeCurationRepository) {}

  browseRisks(query: BrowseRiskSubtypeCurationRisksQuery) {
    if (
      query.subtypeFilter === RiskSubtypeCurationFilterEnum.SPECIFIC &&
      !query.subtypeId
    ) {
      throw new BadRequestException(
        'subtypeId é obrigatório quando subtypeFilter=SPECIFIC.',
      );
    }

    return this.repository.browseRisks({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        type: query.type,
        search: query.search,
        status: query.status,
        onlyPcmso: query.onlyPcmso,
        subtypeFilter: query.subtypeFilter,
        subtypeId: query.subtypeId,
      },
    });
  }

  async bulkAssign(body: BulkAssignRiskSubtypeBody): Promise<RiskSubtypeBulkResult> {
    const uniqueIds = [...new Set(body.riskFactorIds)];
    const mode = body.mode ?? RiskSubtypeBulkAssignModeEnum.REPLACE;

    if (mode !== RiskSubtypeBulkAssignModeEnum.REPLACE) {
      throw new BadRequestException(
        'Nesta fase apenas mode=REPLACE é suportado.',
      );
    }

    const subType = await this.repository.findSubTypeById(body.subTypeId);
    if (!subType) {
      throw new NotFoundException('Subtipo de risco não encontrado.');
    }

    if (subType.status !== StatusEnum.ACTIVE) {
      throw new BadRequestException(
        'Subtipo inativo não pode ser aplicado em massa.',
      );
    }

    const risks = await this.repository.findGlobalRisksByIds(uniqueIds);
    const riskMap = new Map(risks.map((risk) => [risk.id, risk]));

    const result: RiskSubtypeBulkResult = {
      totalRequested: uniqueIds.length,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (const riskFactorId of uniqueIds) {
      const risk = riskMap.get(riskFactorId);

      if (!risk) {
        result.skipped += 1;
        result.errors.push({
          riskFactorId,
          message: 'Risco global não encontrado no catálogo.',
        });
        continue;
      }

      if (risk.type !== subType.type) {
        result.skipped += 1;
        result.errors.push({
          riskFactorId,
          message: `Tipo do risco (${risk.type}) difere do subtipo (${subType.type}).`,
        });
        continue;
      }

      try {
        await this.repository.replaceRiskSubTypes(riskFactorId, subType.id);
        result.updated += 1;
      } catch {
        result.skipped += 1;
        result.errors.push({
          riskFactorId,
          message: 'Falha ao atualizar vínculo de subtipo.',
        });
      }
    }

    return result;
  }

  async bulkClear(body: BulkClearRiskSubtypeBody): Promise<RiskSubtypeBulkResult> {
    const uniqueIds = [...new Set(body.riskFactorIds)];
    const risks = await this.repository.findGlobalRisksByIds(uniqueIds);
    const riskMap = new Map(risks.map((risk) => [risk.id, risk]));

    const result: RiskSubtypeBulkResult = {
      totalRequested: uniqueIds.length,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (const riskFactorId of uniqueIds) {
      if (!riskMap.has(riskFactorId)) {
        result.skipped += 1;
        result.errors.push({
          riskFactorId,
          message: 'Risco global não encontrado no catálogo.',
        });
        continue;
      }

      try {
        await this.repository.clearRiskSubTypes(riskFactorId);
        result.updated += 1;
      } catch {
        result.skipped += 1;
        result.errors.push({
          riskFactorId,
          message: 'Falha ao remover vínculo de subtipo.',
        });
      }
    }

    return result;
  }
}
