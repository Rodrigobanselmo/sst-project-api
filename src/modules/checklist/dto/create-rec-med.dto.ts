import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StringUppercaseTransform } from 'src/shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';

export class CreateRecMedDto {
  @IsNumber()
  riskId: number;

  @IsOptional()
  @IsString()
  recName?: string;

  @IsOptional()
  @IsString()
  medName?: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(StatusEnum, {
    message: `type must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status?: StatusEnum;

  @IsString()
  companyId: string;
}

export class UpsertRecMedDto extends CreateRecMedDto {
  @IsNumber()
  @IsOptional()
  id: number;
}
