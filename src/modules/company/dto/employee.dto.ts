import { PartialType } from '@nestjs/swagger';
import { HierarchyEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { CpfFormatTransform } from '../../../shared/transformers/cpf-format.transform';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateEmployeeDto {
  @Transform(CpfFormatTransform, { toClassOnly: true })
  @Length(11, 11, { message: 'invalid CPF' })
  cpf: string;

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

  @IsString()
  companyId: string;

  @IsString({ each: true })
  @IsOptional()
  workspaceIds: string[];

  @IsString()
  hierarchyId: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  companyId: string;
}

export class FindEmployeeDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  hierarchyId?: string;
}
