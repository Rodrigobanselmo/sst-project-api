import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export interface IESocialPropsDto {
  processing?: number;
  pending?: number;
  done?: number;
  transmitted?: number;
  rejected?: number;
}

export interface DailyCompanyReportDto {
  exam: {
    good?: number;
    expired?: number;
    schedule?: number;
    all?: number;
    expired30?: number;
    expired90?: number;
  };
  esocial: {
    ['S2240']?: IESocialPropsDto;
    ['S2220']?: IESocialPropsDto;
    ['S2210']?: IESocialPropsDto;
  } & IESocialPropsDto;
}

export class UpsertCompanyReportDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastDailyReport?: Date;

  @IsOptional()
  dailyReport?: DailyCompanyReportDto;
}
