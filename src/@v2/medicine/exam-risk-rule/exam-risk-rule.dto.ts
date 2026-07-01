import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  RiskFactorsEnum,
} from '@prisma/client';

import { ToBoolean } from '@/shared/decorators/boolean.decorator';

import { ExamRiskRuleCoverageStatusEnum } from './exam-risk-rule-coverage-gaps.types';

export class BrowseExamRiskRulesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleScopeEnum)
  scope?: PcmsoExamRiskRuleScopeEnum;

  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleStatusEnum)
  status?: PcmsoExamRiskRuleStatusEnum;

  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleSourceEnum)
  source?: PcmsoExamRiskRuleSourceEnum;
}

export class ExamRiskRuleIdPath {
  @IsString()
  id!: string;
}

export class SearchRiskCandidatesQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RiskFactorsEnum)
  type?: RiskFactorsEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class SearchExamCandidatesQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class ExamRiskRuleExamInput {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  examId?: number;

  @IsOptional()
  @IsString()
  examNameSnapshot?: string;

  @IsOptional()
  @IsBoolean()
  isAdmission?: boolean;

  @IsOptional()
  @IsBoolean()
  isPeriodic?: boolean;

  @IsOptional()
  @IsBoolean()
  isChange?: boolean;

  @IsOptional()
  @IsBoolean()
  isReturn?: boolean;

  @IsOptional()
  @IsBoolean()
  isDismissal?: boolean;

  @IsOptional()
  @IsBoolean()
  isMale?: boolean;

  @IsOptional()
  @IsBoolean()
  isFemale?: boolean;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  validityInMonths?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  considerBetweenDays?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fromAge?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  toAge?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minRiskDegree?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minRiskDegreeQuantity?: number | null;
}

export class CreateExamRiskRuleBody {
  @IsEnum(PcmsoExamRiskRuleScopeEnum)
  scope!: PcmsoExamRiskRuleScopeEnum;

  @IsOptional()
  @IsString()
  riskFactorId?: string;

  @IsOptional()
  @IsEnum(RiskFactorsEnum)
  riskCategory?: RiskFactorsEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  riskSubTypeId?: number;

  @IsOptional()
  @IsString()
  agentCas?: string;

  @IsOptional()
  @IsString()
  agentName?: string;

  @IsEnum(PcmsoExamRiskRuleSourceEnum)
  source!: PcmsoExamRiskRuleSourceEnum;

  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleStatusEnum)
  status?: PcmsoExamRiskRuleStatusEnum;

  @IsOptional()
  @IsString()
  rationale?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamRiskRuleExamInput)
  exams?: ExamRiskRuleExamInput[];
}

export class UpdateExamRiskRuleBody {
  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleScopeEnum)
  scope?: PcmsoExamRiskRuleScopeEnum;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsString()
  riskFactorId?: string | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsEnum(RiskFactorsEnum)
  riskCategory?: RiskFactorsEnum | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  riskSubTypeId?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsString()
  agentCas?: string | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsString()
  agentName?: string | null;

  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleSourceEnum)
  source?: PcmsoExamRiskRuleSourceEnum;

  @IsOptional()
  @IsEnum(PcmsoExamRiskRuleStatusEnum)
  status?: PcmsoExamRiskRuleStatusEnum;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsString()
  rationale?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamRiskRuleExamInput)
  exams?: ExamRiskRuleExamInput[];
}

export class UpdateExamRiskRuleStatusBody {
  @IsEnum(PcmsoExamRiskRuleStatusEnum)
  status!: PcmsoExamRiskRuleStatusEnum;
}

/** Frase de dupla confirmação que o MASTER deve digitar para aplicar o import. */
export const EXAM_RISK_RULE_APPLY_CONFIRM_TEXT = 'APLICAR CURADORIA EXAME X RISCO';

export class ImportExamRiskRuleApplyBody {
  /** Multipart envia booleano como string — deve ser o literal "true". */
  @IsBooleanString()
  confirmApply!: string;

  @Matches(new RegExp(`^${EXAM_RISK_RULE_APPLY_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${EXAM_RISK_RULE_APPLY_CONFIRM_TEXT}".`,
  })
  confirmText!: string;
}

export class BrowseExamRiskRuleCoverageGapsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(RiskFactorsEnum)
  type?: RiskFactorsEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ExamRiskRuleCoverageStatusEnum)
  coverageStatus?: ExamRiskRuleCoverageStatusEnum;

  @IsOptional()
  @ToBoolean()
  includeIndirect?: boolean = true;

  @IsOptional()
  @ToBoolean()
  onlyPcmso?: boolean = true;
}
