import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { QueryArray } from './../../../shared/transformers/query-array';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

export enum ReportDownloadtypeEnum {
  XML = 'XML',
  HTML = 'HTML',
  PDF = 'PDF',
}

export class BaseReportDto {
  @IsOptional()
  @IsString()
  downloadType?: ReportDownloadtypeEnum;
}
