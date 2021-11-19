import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUppercase,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

import { CepFormatTransform } from '../../../shared/transformers/cep-format.transform';
import { NumberFormat } from '../../../shared/transformers/number-format';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class AddressDto {
  @Matches(/[1-9][0-9]*/, {
    message: 'The number address has an invalid format',
  })
  @Length(1, 12)
  @Transform(NumberFormat, { toClassOnly: true })
  number: string;

  @Transform(CepFormatTransform, { toClassOnly: true })
  @Length(9, 9)
  cep: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  complement: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @MaxLength(50)
  @IsOptional()
  @IsString()
  neighborhood: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(30)
  city: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @Length(2, 2)
  @IsUppercase()
  state: string;
}
