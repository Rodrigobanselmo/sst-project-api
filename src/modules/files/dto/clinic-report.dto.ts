import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryArray } from 'src/shared/transformers/query-array';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { BaseReportDto } from './base-report.dto';

export class DownloudClinicReportDto extends BaseReportDto {
  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  cities?: string[];

  @Transform(QueryArray, { toClassOnly: true })
  @IsString({ each: true })
  @IsOptional()
  uf?: string[];
}

// export class FindAccessGroupDto extends PaginationQueryDto {
//   @IsOptional()
//   @IsNumber()
//   id: number;

//   @IsString()
//   @IsOptional()
//   search: string;

//   @IsString({ each: true })
//   @IsOptional()
//   roles: string[];

//   @IsOptional()
//   @IsString({ each: true })
//   permissions: string[];
// }
