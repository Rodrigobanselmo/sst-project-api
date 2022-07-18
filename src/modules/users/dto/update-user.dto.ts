import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
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
  crea?: string;

  @IsString({ each: true })
  @IsOptional()
  certifications?: string;

  @IsString({ each: true })
  @IsOptional()
  formation?: string;

  @IsString()
  @IsOptional()
  readonly token?: string;
}
