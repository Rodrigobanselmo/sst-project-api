import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { PartialType } from '@nestjs/swagger';
import { HierarchyEnum, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested } from 'class-validator';
import { StringCapitalizeParagraphTransform } from '../../../shared/transformers/string-capitalize-paragraph';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateHierarchyDto {
  @IsString()
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

  @IsString()
  @IsOptional()
  ghoName: string;

  @IsString({ each: true })
  @IsOptional()
  ghoNames?: string[];

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @ValidateIf((customer) => customer.description !== '')
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @ValidateIf((customer) => customer.description !== '')
  @IsString()
  @IsOptional()
  realDescription?: string;

  @IsString({ each: true })
  workspaceIds?: string[];

  @IsInt({ each: true })
  employeesIds?: number[];

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

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsInt({ each: true })
  @IsOptional()
  employeesIds?: number[];

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

  @IsString()
  @IsOptional()
  refName?: string;

  @IsOptional()
  @IsString({ each: true })
  workspaceIds?: string[];

  @IsString()
  @IsOptional()
  parentId?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(StringCapitalizeParagraphTransform, { toClassOnly: true })
  @ValidateIf((customer) => customer.description !== '')
  @IsString()
  @IsOptional()
  realDescription?: string;
}

export class UpsertManyHierarchyDto {
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpsertHierarchyDto)
  readonly data: UpsertHierarchyDto[];
}

export class UpdateSimpleHierarchyDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  refName?: string;
}
export class UpdateSimpleManyHierarchyDto {
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateSimpleHierarchyDto)
  readonly data: UpdateSimpleHierarchyDto[];
}

export class CreateSubHierarchyDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  realDescription: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status: StatusEnum;

  @IsString()
  companyId: string;

  @IsInt({ each: true })
  @IsOptional()
  employeesIds?: number[];

  @IsString()
  parentId?: string;
}

export class FindHierarchyDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  hierarchyId?: string;

  @IsString()
  @IsOptional()
  homogeneousGroupId?: string;

  @IsOptional()
  @IsDate({ message: 'Data inválida' })
  @Type(() => Date)
  endDate: Date;
}
