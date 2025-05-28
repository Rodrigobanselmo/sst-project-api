import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class AbsenteeismQuery {
  @IsString({ each: true })
  @IsOptional()
  workspacesIds?: string[];

  @IsString({ each: true })
  @IsOptional()
  hierarchiesIds?: string[];

  @IsInt({ each: true })
  @IsOptional()
  motivesIds?: number[];

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
