import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ToBoolean } from '../../../shared/decorators/boolean.decorator';
import { UpsertDocumentDataDto } from './document-data.dto';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export class DocumentDataPGRDto {
  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  validity: string;

  @IsOptional()
  @IsString({ each: true })
  complementaryDocs: string[];

  @IsOptional()
  @IsString({ each: true })
  complementarySystems: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  visitDate?: Date;

  @IsOptional()
  @IsInt()
  months_period_level_2: number;

  @IsOptional()
  @IsInt()
  months_period_level_3: number;

  @IsOptional()
  @IsInt()
  months_period_level_4: number;

  @IsOptional()
  @IsInt()
  months_period_level_5: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isQ5: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isHideOriginColumn: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isHideCA: boolean;

  @IsOptional()
  @IsEnum(HierarchyTypeEnum)
  aprTypeSeparation: HierarchyTypeEnum;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  hasEmergencyPlan: boolean;
}

export class UpsertDocumentDataPGRDto extends UpsertDocumentDataDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => DocumentDataPGRDto)
  json?: DocumentDataPGRDto;
}
