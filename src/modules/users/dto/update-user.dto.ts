import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { ApiProperty } from '@nestjs/swagger';
import { ProfessionalTypeEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CpfFormatTransform } from '../../../shared/transformers/cpf-format.transform';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';

export class UpdateUserDto {
  @ApiProperty({ description: 'user older password' })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  password?: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @Transform(CpfFormatTransform, { toClassOnly: true })
  @IsString({ message: 'CPF inválido' })
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  googleExternalId?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  crea?: string;

  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  @IsString({ each: true })
  @IsOptional()
  formation?: string[];

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

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(ProfessionalTypeEnum, {
    message: `Tipo de profissional inválido`,
  })
  type?: ProfessionalTypeEnum;

  @IsString()
  @IsOptional()
  readonly token?: string;
}
