import { IsInt, IsOptional, IsString } from 'class-validator';

export class ActivityDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  @IsOptional()
  riskDegree: number;
}
