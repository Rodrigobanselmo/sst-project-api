import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ActivityDto {
  @MaxLength(100)
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @MaxLength(10)
  code: string;
}
