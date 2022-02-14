import { StatusEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsObject, IsString, ValidateNested } from 'class-validator';
import { StringUppercaseTransform } from 'src/shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';
import { ChecklistDataDto } from './checklist-data';

export class CreateChecklistDto {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @ValidateNested()
  @IsObject()
  @Type(() => ChecklistDataDto)
  data?: ChecklistDataDto;
}
