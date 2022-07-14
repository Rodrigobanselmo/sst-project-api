import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ActivityDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsBoolean()
  @IsOptional()
  riskDegree: number;
}
