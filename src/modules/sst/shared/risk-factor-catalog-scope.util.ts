import { ForbiddenException } from '@nestjs/common';

import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';

export const GLOBAL_CATALOG_RISK_FORBIDDEN_MESSAGE =
  'Este fator de risco pertence ao catálogo padrão e não pode ser alterado por este usuário.';

export type RiskFactorCatalogScopeSource = {
  system?: boolean;
  representAll?: boolean;
};

export const isGlobalCatalogRiskFactor = (
  risk: RiskFactorCatalogScopeSource,
): boolean => Boolean(risk.system) || Boolean(risk.representAll);

export const canUserEditGlobalCatalogRiskFactor = (
  user: Pick<UserPayloadDto, 'isSystem'>,
): boolean => Boolean(user.isSystem);

export const assertCanUpdateRiskFactor = (
  risk: RiskFactorCatalogScopeSource,
  user: Pick<UserPayloadDto, 'isSystem'>,
): void => {
  if (
    isGlobalCatalogRiskFactor(risk) &&
    !canUserEditGlobalCatalogRiskFactor(user)
  ) {
    throw new ForbiddenException(GLOBAL_CATALOG_RISK_FORBIDDEN_MESSAGE);
  }
};

/**
 * Futuro: permitir "Criar cópia deste fator de risco para minha empresa" com
 * `system: false`, `companyId` da empresa do usuário e cópia dos campos
 * técnicos (risk, symptoms, severity, limites etc.) sem alterar o catálogo global.
 */
