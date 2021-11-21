import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { CompanyTypesEnum } from '../../../shared/constants/enum/company-types.enum';
import { StatusEnum } from '../../../shared/constants/enum/status.enum';
import { CnpjFormatTransform } from '../../../shared/transformers/cnpj-format.transform';
import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { ActivityDto } from './activity.dto';
import { LicenseDto } from './license.dto';
import { WorkspaceDto } from './workspace.dto';

export class CreateCompanyDto {
  @Transform(CnpjFormatTransform, { toClassOnly: true })
  @Length(18, 18, { message: 'invalid CNPJ' })
  cnpj: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  fantasy: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${KeysOfEnum(StatusEnum)}`,
  })
  status: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsEnum(CompanyTypesEnum, {
    message: `type must be one of: ${KeysOfEnum(CompanyTypesEnum)}`,
  })
  type: string;

  @IsOptional()
  @IsBoolean()
  isConsulting: boolean;

  @ValidateNested()
  @Type(() => LicenseDto)
  license?: LicenseDto;

  @ValidateNested({ each: true })
  @IsDefined()
  @ArrayNotEmpty()
  @Type(() => WorkspaceDto)
  readonly workspace: WorkspaceDto[];

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => ActivityDto)
  readonly primary_activity: ActivityDto[];

  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => ActivityDto)
  readonly secondary_activity: ActivityDto[];
}
