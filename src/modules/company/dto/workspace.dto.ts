import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { AddressDto } from './address.dto';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { StatusEnum } from '@prisma/client';

export class WorkspaceDto {
  @IsNumber()
  @IsString()
  id?: string;

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
