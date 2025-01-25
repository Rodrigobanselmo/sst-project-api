import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddUserPayload {
  @IsString()
  name!: string;

  @IsNumber()
  @Type(() => Number)
  groupId!: number;

  @IsString()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  phone?: string | null;

  @IsString()
  @IsOptional()
  cpf?: string | null;
}
