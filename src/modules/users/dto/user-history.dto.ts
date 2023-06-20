import { PaginationQueryDto } from './../../../shared/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { KeysOfEnum } from '../../../shared/utils/keysOfEnum.utils';
import { StringUppercaseTransform } from '../../../shared/transformers/string-uppercase.transform';
import { StatusEnum } from '@prisma/client';

export class CreateUserHistoryDto {
  companyId: string;
  ip: string;
  city: string;
  country: string;
  region: string;
  userAgent: string;
  userId: number;
}

export class UpdateUserHistoryDto {
  id: number;
  companyId: string;
}

export class FindUserHistoryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsInt()
  @IsOptional()
  userId?: number;
}
