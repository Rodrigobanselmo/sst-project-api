import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export class BaseReportDto {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isXml?: boolean;
}
