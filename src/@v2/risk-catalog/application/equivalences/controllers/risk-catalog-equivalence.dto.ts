import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  RiskCatalogEquivalenceType,
  RiskCatalogKind,
} from '@prisma/client';

import { ToBoolean } from '@/shared/decorators/boolean.decorator';

export class SearchRiskCatalogItemsQuery {
  @IsEnum(RiskCatalogKind)
  kind!: RiskCatalogKind;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  riskId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ToBoolean()
  includeSystem?: boolean;

  @IsOptional()
  @ToBoolean()
  includeDeleted?: boolean;
}

export class BrowseRiskCatalogEquivalencesQuery {
  @IsOptional()
  @IsEnum(RiskCatalogKind)
  kind?: RiskCatalogKind;

  @IsOptional()
  @IsString()
  riskId?: string;

  @IsOptional()
  @IsString()
  canonicalId?: string;

  @IsOptional()
  @IsString()
  aliasId?: string;

  @IsOptional()
  @ToBoolean()
  includeRevoked?: boolean;
}

export class PreviewRiskCatalogEquivalenceImpactPayload {
  @IsEnum(RiskCatalogKind)
  kind!: RiskCatalogKind;

  @IsString()
  canonicalId!: string;

  @IsString()
  aliasId!: string;

  @IsString()
  riskId!: string;
}

export class RegisterRiskCatalogEquivalencePayload {
  @IsEnum(RiskCatalogKind)
  kind!: RiskCatalogKind;

  @IsEnum(RiskCatalogEquivalenceType)
  equivalenceType!: RiskCatalogEquivalenceType;

  @IsString()
  riskId!: string;

  @IsString()
  canonicalId!: string;

  @IsString()
  aliasId!: string;

  @IsOptional()
  @IsString()
  normalizedKey?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RevokeRiskCatalogEquivalencePath {
  @IsUUID()
  id!: string;
}

export class RevokeRiskCatalogEquivalencePayload {
  @IsString()
  revokeReason!: string;
}
