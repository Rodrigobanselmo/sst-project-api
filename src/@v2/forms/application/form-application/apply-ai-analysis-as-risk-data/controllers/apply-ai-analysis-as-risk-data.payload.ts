import { MeasuresTypeEnum, RecTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class GenerateSourceItemPayload {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class RecMedItemPayload {
  @IsString()
  @IsOptional()
  recName?: string;

  @IsString()
  @IsOptional()
  medName?: string;

  @IsOptional()
  @IsEnum(MeasuresTypeEnum)
  medType?: MeasuresTypeEnum;

  @IsOptional()
  @IsEnum(RecTypeEnum)
  recType?: RecTypeEnum;
}

export class ApplyAiAnalysisAsRiskDataPayload {
  @IsString()
  @IsNotEmpty()
  hierarchyId!: string;

  @IsString()
  @IsNotEmpty()
  riskId!: string;

  @IsNumber()
  @IsOptional()
  probability?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GenerateSourceItemPayload)
  generateSourcesAddOnly?: GenerateSourceItemPayload[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecMedItemPayload)
  engsAddOnly?: RecMedItemPayload[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecMedItemPayload)
  recAddOnly?: RecMedItemPayload[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecMedItemPayload)
  admsAddOnly?: RecMedItemPayload[];
}
