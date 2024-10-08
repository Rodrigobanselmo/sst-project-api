import { QueryArray } from './../../../shared/transformers/query-array';
import { StringUppercaseTransform } from './../../../shared/transformers/string-uppercase.transform';
import { ProfessionalTypeEnum, UfStateEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { CpfFormatTransform } from '../../../shared/transformers/cpf-format.transform';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { CouncilDto } from './council.dto';

export class UpdateUserDto {
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
  googleUser?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  @IsString({ each: true })
  @IsOptional()
  formation?: string[];

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

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CouncilDto)
  councils?: CouncilDto[];

  councilType?: string;
  councilUF?: string;
  councilId?: string;
}
