import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertCompanyGroupDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @ValidateIf((o) => !o.id)
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  companyId: string;

  @IsOptional()
  @IsInt()
  numAsos?: number;

  @IsOptional()
  @IsBoolean()
  blockResignationExam?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  esocialStart?: Date;

  @IsOptional()
  @IsInt()
  doctorResponsibleId: number;

  @ValidateIf((o) => !o.id)
  @IsString({ each: true })
  companiesIds: string[];
}

export class FindCompanyGroupDto extends PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  search: string[];

  @IsString()
  @IsOptional()
  name: string;
}
