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

import { StatusEnum } from '../../../shared/constants/enum/status.enum';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { AddressDto } from './address.dto';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class WorkspaceDto {
  @IsNumber()
  @IsOptional()
  id?: number;

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
  status: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => AddressDto)
  readonly address: AddressDto;
}
