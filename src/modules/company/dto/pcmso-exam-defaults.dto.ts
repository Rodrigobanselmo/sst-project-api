import { IsBoolean, IsInt, IsOptional, ValidateIf } from 'class-validator';

import { ToBoolean } from '../../../shared/decorators/boolean.decorator';

/**
 * Padrões de PCMSO da empresa (Fase 3). Persistidos em
 * Company.metadata.pcmsoExamDefaults e usados apenas para pré-preencher o modal
 * de NOVO vínculo Exame × Risco. Todos os campos são opcionais; campos
 * numéricos aceitam null para representar "sem padrão / limpar".
 */
export class PcmsoExamDefaultsDto {
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isMale?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isFemale?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isPeriodic?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isChange?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isAdmission?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isReturn?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isDismissal?: boolean;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  validityInMonths?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  considerBetweenDays?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  fromAge?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  toAge?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  minRiskDegree?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsOptional()
  minRiskDegreeQuantity?: number | null;
}

export const PCMSO_EXAM_DEFAULTS_METADATA_KEY = 'pcmsoExamDefaults';

export const PCMSO_EXAM_DEFAULTS_FIELDS: (keyof PcmsoExamDefaultsDto)[] = [
  'isMale',
  'isFemale',
  'isPeriodic',
  'isChange',
  'isAdmission',
  'isReturn',
  'isDismissal',
  'validityInMonths',
  'considerBetweenDays',
  'fromAge',
  'toAge',
  'minRiskDegree',
  'minRiskDegreeQuantity',
];
