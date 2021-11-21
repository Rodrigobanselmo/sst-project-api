import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { StatusEnum } from '../../../shared/constants/enum/status.enum';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';

export class LicenseDto {
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: string;
}
