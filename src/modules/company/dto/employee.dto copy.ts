import { PartialType } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { CpfFormatTransform } from 'src/shared/transformers/cpf-format.transform';

import { StringCapitalizeTransform } from '../../../shared/transformers/string-capitalize';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';

export class CreateEmployeeDto {
  @Transform(CpfFormatTransform, { toClassOnly: true })
  @Length(14, 14, { message: 'invalid CPF' })
  cpf: string;

  @Transform(StringCapitalizeTransform, { toClassOnly: true })
  @IsString()
  @MaxLength(100)
  name: string;

  @Transform(StringUppercaseTransform, { toClassOnly: true })
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be one of: ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status: StatusEnum;

  @IsString()
  companyId: string;

  @IsNumber()
  workplaceId: number;

  @IsNumber()
  hierarchyId: number;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  companyId: string;
}
