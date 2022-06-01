import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class HierarchyOnHomoDto {
  @IsString()
  workspaceId: string;

  @IsString()
  id: string;
}
export class CreateHomoGroupDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
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

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => HierarchyOnHomoDto)
  readonly hierarchies?: HierarchyOnHomoDto[];
}
