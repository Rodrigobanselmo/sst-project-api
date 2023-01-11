import { PartialType } from '@nestjs/swagger';
import { ProfessionalTypeEnum, StatusEnum, UfStateEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { CpfFormatTransform } from './../../../shared/transformers/cpf-format.transform';
import { QueryArray } from './../../../shared/transformers/query-array';
import { StringCapitalizeTransform } from './../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { CouncilDto } from './council.dto';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

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

  // @IsString()
  // @IsOptional()
  // councilType?: string;

  // @IsString()
  // @IsOptional()
  // councilUF?: string;

  // @IsString()
  // @IsOptional()
  // councilId?: string;

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

  @IsString()
  @IsOptional()
  inviteId?: string;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  sendEmail?: boolean;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CouncilDto)
  councils?: CouncilDto[];
}

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  @IsInt()
  @IsOptional()
  readonly id: number;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CouncilDto)
  councils?: CouncilDto[];
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

  @IsOptional()
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsEnum(UfStateEnum, {
    message: `UF inválido`,
  })
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
  @IsBoolean()
  @ToBoolean()
  byCouncil?: boolean;

  @IsOptional()
  @Transform(QueryArray, { toClassOnly: true })
  @IsEnum(ProfessionalTypeEnum, {
    message: `Tipo de profissional inválido`,
    each: true,
  })
  type: ProfessionalTypeEnum[];
}
