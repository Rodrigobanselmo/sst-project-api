import { IsOptional, IsString } from 'class-validator';

export class ActivityDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  code: string;
}
