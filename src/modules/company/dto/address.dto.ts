import { UfStateEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { CepFormatTransform } from '../../../shared/transformers/cep-format.transform';
import { NumberFormat } from '../../../shared/transformers/number-format';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringNormalizeUpperTransform } from '../../../shared/transformers/string-normalize.transform';

export class AddressDto {
  // @Matches(/[1-9][0-9]*/, {
  //   message: 'The number address has an invalid format',
  // })
  @IsString()
  @Length(1, 12)
  @IsOptional()
  @Transform(NumberFormat, { toClassOnly: true })
  number: string;

  @Transform(CepFormatTransform, { toClassOnly: true })
  @Length(8, 8)
  cep: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  complement: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  neighborhood: string;

  @IsOptional()
  @Transform(StringNormalizeUpperTransform, { toClassOnly: true })
  @IsString()
  city: string;

  @IsOptional()
  @Transform(StringNormalizeUpperTransform, { toClassOnly: true })
  @IsEnum(UfStateEnum, {
    message: `UF inválido`,
    each: true,
  })
  state: string;
}
