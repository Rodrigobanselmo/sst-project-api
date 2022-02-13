import { RiskFactorsEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { StringUppercaseTransform } from 'src/shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from 'src/shared/utils/keysOfEnum.utils';

export class CreateRiskDto {
  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(RiskFactorsEnum, {
    message: `type must be one of: ${KeysOfEnum(RiskFactorsEnum)}`,
  })
  type: RiskFactorsEnum;

  @IsString()
  name: string;

  @IsString()
  companyId: string;
}
