import { CnpjFormatTransform } from './../../../shared/transformers/cnpj-format.transform';
import { Prisma, StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsEnum, IsOptional, IsString, Length, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { AddressDto } from './address.dto';

export class WorkspaceDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  abbreviation?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateIf((o) => o.cnpj)
  @Transform(CnpjFormatTransform, { toClassOnly: true })
  @IsOptional()
  @Length(14, 14, { message: 'invalid CNPJ' })
  cnpj?: string;

  @IsOptional()
  @IsBoolean()
  isOwner?: boolean;

  @IsOptional()
  companyJson?: Prisma.JsonValue;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status: StatusEnum;

  @ValidateNested()
  @IsDefined()
  @Type(() => AddressDto)
  readonly address: AddressDto;
}
