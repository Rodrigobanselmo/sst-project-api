import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CompanyOSDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  companyId: string;

  @IsOptional()
  socialName: any;

  @IsOptional()
  med: any;

  @IsOptional()
  rec: any;

  @IsOptional()
  obligations: any;

  @IsOptional()
  prohibitions: any;

  @IsOptional()
  procedures: any;

  @IsOptional()
  cipa: any;

  @IsOptional()
  declaration: any;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `Status inválido`,
  })
  status?: StatusEnum;
}
