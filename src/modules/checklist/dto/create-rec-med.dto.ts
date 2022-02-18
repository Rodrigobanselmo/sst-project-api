import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { StringUppercaseTransform } from 'src/shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';

export class CreateRecMedDto {
  @IsString()
  recName: string;

  @IsString()
  medName: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;
}
