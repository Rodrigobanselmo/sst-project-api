import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DocumentGenerationRiskFilterDto {
  @IsIn(['EXCLUDE'])
  mode: 'EXCLUDE';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedRiskFactorIds?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(RiskTypeEnum, { each: true })
  excludedCategoryIds?: RiskTypeEnum[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  excludedSubcategoryIds?: number[];
}
