import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { RiskCreateGenerateSourceDto, RiskUpdateGenerateSourceDto, UpsertGenerateSourceDto } from './generate-source.dto';

import { RiskCreateRecMedDto, RiskUpdateRecMedDto, UpsertRecMedDto } from './rec-med.dto';

export class CreateRiskDto {
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type: RiskFactorsEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @IsNumber()
  severity: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @IsString()
  @IsOptional()
  esocialCode?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateRecMedDto)
  recMed?: RiskCreateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskCreateGenerateSourceDto)
  generateSource?: RiskCreateGenerateSourceDto[];

  @IsOptional()
  @IsBoolean()
  isAso?: boolean;

  @IsOptional()
  @IsBoolean()
  isPGR?: boolean;

  @IsOptional()
  @IsBoolean()
  isPCMSO?: boolean;

  @IsOptional()
  @IsBoolean()
  isPPP?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @IsString()
  @IsOptional()
  risk?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString({ each: true })
  @IsOptional()
  propagation?: string[];

  //FIS QUI

  @IsString()
  @IsOptional()
  unit?: string;

  //QUI

  @IsString()
  @IsOptional()
  cas?: string;

  @IsString()
  @IsOptional()
  breather?: string;

  @IsString()
  @IsOptional()
  nr15lt?: string;

  @IsString()
  @IsOptional()
  twa?: string;

  @IsString()
  @IsOptional()
  stel?: string;

  @IsString()
  @IsOptional()
  vmp?: string;

  @IsString()
  @IsOptional()
  ipvs?: string;

  @IsString()
  @IsOptional()
  pv?: string;

  @IsString()
  @IsOptional()
  pe?: string;

  @IsString()
  @IsOptional()
  carnogenicityACGIH?: string;

  @IsString()
  @IsOptional()
  carnogenicityLinach?: string;

  @IsString()
  @IsOptional()
  fraction?: string;

  @IsString()
  @IsOptional()
  tlv?: string;

  @IsString()
  @IsOptional()
  coments?: string;
}

export class UpsertRiskDto extends CreateRiskDto {
  @IsString()
  @IsOptional()
  id: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertRecMedDto)
  recMed?: UpsertRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertGenerateSourceDto)
  generateSource?: UpsertGenerateSourceDto[];
}

export class UpdateRiskDto {
  @IsString()
  id: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type?: RiskFactorsEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  severity?: number;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;

  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @IsString()
  @IsOptional()
  esocialCode?: string;

  @IsString()
  @IsOptional()
  risk?: string;

  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString({ each: true })
  @IsOptional()
  propagation?: string[];

  //FIS QUI

  @IsString()
  @IsOptional()
  unit?: string;

  //QUI

  @IsString()
  @IsOptional()
  cas?: string;

  @IsString()
  @IsOptional()
  breather?: string;

  @IsString()
  @IsOptional()
  nr15lt?: string;

  @IsString()
  @IsOptional()
  twa?: string;

  @IsString()
  @IsOptional()
  stel?: string;

  @IsString()
  @IsOptional()
  vmp?: string;

  @IsString()
  @IsOptional()
  ipvs?: string;

  @IsString()
  @IsOptional()
  pv?: string;

  @IsString()
  @IsOptional()
  pe?: string;

  @IsString()
  @IsOptional()
  carnogenicityACGIH?: string;

  @IsString()
  @IsOptional()
  carnogenicityLinach?: string;

  @IsString()
  @IsOptional()
  fraction?: string;

  @IsString()
  @IsOptional()
  tlv?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskUpdateRecMedDto)
  recMed?: RiskUpdateRecMedDto[];

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => RiskUpdateGenerateSourceDto)
  generateSource?: RiskUpdateGenerateSourceDto[];

  @IsOptional()
  @IsBoolean()
  isAso?: boolean;

  @IsOptional()
  @IsBoolean()
  isPGR?: boolean;

  @IsOptional()
  @IsBoolean()
  isPCMSO?: boolean;

  @IsOptional()
  @IsBoolean()
  isPPP?: boolean;

  @IsString()
  @IsOptional()
  coments?: string;
}

export class FindRiskDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsBoolean()
  @IsOptional()
  representAll: boolean;
}
