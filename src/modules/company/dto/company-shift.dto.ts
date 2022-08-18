import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';

export class CreateCompanyShiftDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  companyId: string;
}

export class UpdateCompanyShiftDto extends PartialType(CreateCompanyShiftDto) {
  @IsInt()
  @IsOptional()
  id: number;
}

export class FindCompanyShiftDto extends PaginationQueryDto {
  @IsOptional()
  companyId: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
