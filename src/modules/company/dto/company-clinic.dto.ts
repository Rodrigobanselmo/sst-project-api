import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { QueryArray } from '../../../shared/transformers/query-array';

export class CreateCompanyClinicDto {
  @IsString()
  companyId: string;

  @IsString()
  clinicId: string;
}

export class TestRoute123CompanyDto {
  @IsString()
  companyId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true, message: 'ok' })
  @Type(() => CreateCompanyClinicDto)
  x: CreateCompanyClinicDto[];
}

export class UpdateCompanyClinicDto extends PartialType(CreateCompanyClinicDto) {}

export class SetCompanyClinicDto {
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => CreateCompanyClinicDto)
  ids?: CreateCompanyClinicDto[];
}

export class FindCompanyClinicDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  clinicId?: string[];
}
