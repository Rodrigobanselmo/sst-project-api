import { QueryArray } from './../../../shared/transformers/query-array';
import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusEnum } from '@prisma/client';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPrincipal: boolean;

  @IsString()
  @IsOptional()
  phone_1: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  obs: string;
}

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isPrincipal: boolean;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status: StatusEnum;
}

export class FindContactDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString()
  companyId: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companiesIds?: string[];
}
