import { PartialType } from '@nestjs/swagger';
import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { DateFormat } from './../../../shared/transformers/date-format';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';

export class CreateEmployeeHierarchyHistoryDto {
  @IsInt()
  @IsOptional()
  employeeId: number;

  @IsString()
  @IsOptional()
  hierarchyId: string;

  @IsOptional()
  @Transform(DateFormat, { toClassOnly: true })
  @IsDate({ message: 'Data de realização de exame inválida' })
  @Type(() => Date)
  startDate: Date;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(EmployeeHierarchyMotiveTypeEnum, {
    message: `tipo de motivo inválido`,
  })
  motive: EmployeeHierarchyMotiveTypeEnum;
}

export class UpdateEmployeeHierarchyHistoryDto extends PartialType(
  CreateEmployeeHierarchyHistoryDto,
) {
  @IsInt()
  @IsOptional()
  id: number;
}

export class FindEmployeeHierarchyHistoryDto extends PaginationQueryDto {
  @IsString()
  companyId?: string;

  @IsString()
  @IsOptional()
  hierarchyId?: string;

  @IsOptional()
  @IsInt()
  employeeId?: number;
}
