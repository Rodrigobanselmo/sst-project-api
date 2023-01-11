import { StatusEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { BaseReportDto } from './base-report.dto';

export class DownloudClinicReportDto extends BaseReportDto {}

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
