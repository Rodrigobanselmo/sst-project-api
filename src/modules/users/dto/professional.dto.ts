import { PartialType } from '@nestjs/swagger';
import { ProfessionalTypeEnum, StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { CpfFormatTransform } from './../../../shared/transformers/cpf-format.transform';
import { QueryArray } from './../../../shared/transformers/query-array';
import { StringCapitalizeTransform } from './../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';

export class CreateProfessionalDto {
  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  name: string;

  @Transform(CpfFormatTransform, { toClassOnly: true })
  @IsString({ message: 'CPF inválido' })
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  councilType?: string;

  @IsString()
  @IsOptional()
  councilUF?: string;

  @IsString()
  @IsOptional()
  councilId?: string;

  @IsString()
  @IsOptional()
  crm?: string;

  @IsString()
  @IsOptional()
  crea?: string;

  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  @IsString({ each: true })
  @IsOptional()
  formation?: string[];

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(ProfessionalTypeEnum, {
    message: `Tipo de profissional inválido`,
  })
  type: ProfessionalTypeEnum;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Tipo de status inválido`,
  })
  status?: StatusEnum;
}

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  @IsInt()
  @IsOptional()
  readonly id: number;
}

export class FindProfessionalsDto extends PaginationQueryDto {
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
  email?: string;

  @IsString()
  @IsOptional()
  councilType?: string;

  @IsString()
  @IsOptional()
  councilUF?: string;

  @IsString()
  @IsOptional()
  councilId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  companies?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsInt({ each: true })
  @IsOptional()
  id?: number[];

  @IsString()
  @IsOptional()
  userCompanyId?: string;

  @IsOptional()
  @Transform(QueryArray, { toClassOnly: true })
  @IsEnum(ProfessionalTypeEnum, {
    message: `Tipo de profissional inválido`,
    each: true,
  })
  type: ProfessionalTypeEnum[];
}
