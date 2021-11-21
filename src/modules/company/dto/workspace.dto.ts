import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

import { StatusEnum } from '../../../shared/constants/enum/status.enum';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { AddressDto } from './address.dto';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class WorkspaceDto {
  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => AddressDto)
  readonly address: AddressDto;
}
