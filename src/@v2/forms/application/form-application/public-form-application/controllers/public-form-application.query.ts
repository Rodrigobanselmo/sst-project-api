import { IsOptional, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PublicFormApplicationQuery {
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  employeeId?: number;
}
