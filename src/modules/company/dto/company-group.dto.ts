import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from './../../../shared/decorators/boolean.decorator';

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
  @ToBoolean()
  blockResignationExam?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  esocialStart?: Date;

  @IsOptional()
  @IsInt()
  doctorResponsibleId: number;

  @IsOptional()
  @IsInt()
  tecResponsibleId?: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  esocialSend?: boolean;

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
