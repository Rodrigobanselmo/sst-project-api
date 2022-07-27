import { HomoTypeEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class HierarchyOnHomoDto {
  @IsString()
  workspaceId: string;

  @IsString()
  id: string;
}
export class CreateHomoGroupDto {
  @IsOptional()
  @IsString()
  id?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(HomoTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(HomoTypeEnum)}`,
  })
  type?: HomoTypeEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  description: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;
}

export class UpdateHomoGroupDto {
  @IsOptional()
  @IsString()
  id?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(HomoTypeEnum, {
    message: `type must be one of: ${KeysOfEnum(HomoTypeEnum)}`,
  })
  type?: HomoTypeEnum;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => HierarchyOnHomoDto)
  readonly hierarchies?: HierarchyOnHomoDto[];
}

export class CopyHomogeneousGroupDto {
  @ValidateIf((o) => !o.hierarchyId || o.actualGroupId)
  @IsString()
  actualGroupId: string;

  @IsString()
  riskGroupId: string;

  @IsString()
  copyFromHomoGroupId: string;

  @IsString()
  companyIdFrom: string;

  @IsString()
  riskGroupIdFrom: string;

  @IsOptional()
  @IsString()
  type?: HomoTypeEnum;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @ValidateIf((o) => !o.actualGroupId || o.hierarchyId)
  @IsOptional()
  @IsString()
  hierarchyId?: string;
}
