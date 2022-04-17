import { PartialType } from '@nestjs/swagger';
import { HierarchyEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateHierarchyDto {
  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status: StatusEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(HierarchyEnum, {
    message: `type must be one of: ${HierarchyEnum.DIRECTORY} or ${HierarchyEnum.MANAGEMENT} or ${HierarchyEnum.SECTOR} or ${HierarchyEnum.OFFICE}`,
  })
  type: HierarchyEnum;

  @IsString()
  companyId: string;

  @IsNumber()
  workplaceId: number;

  @IsString()
  @IsOptional()
  parentId?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateHierarchyDto)
  readonly children?: CreateHierarchyDto[];
}

export class UpdateHierarchyDto extends PartialType(CreateHierarchyDto) {
  @IsOptional()
  @IsString()
  id?: string;
}

export class UpsertHierarchyDto {
  @IsOptional()
  @IsString()
  id?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status?: StatusEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(HierarchyEnum, {
    message: `type must be one of: ${HierarchyEnum.DIRECTORY} or ${HierarchyEnum.MANAGEMENT} or ${HierarchyEnum.SECTOR} or ${HierarchyEnum.OFFICE}`,
  })
  type?: HierarchyEnum;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsNumber()
  @IsOptional()
  workplaceId?: number;

  @IsString()
  @IsOptional()
  parentId?: string;
}

export class UpsertManyHierarchyDto {
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertHierarchyDto)
  readonly data: UpsertHierarchyDto[];
}
