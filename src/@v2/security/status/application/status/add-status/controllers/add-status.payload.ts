import { IsOptional, IsString } from 'class-validator';

export class AddStatusPayload {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  color?: string | null;

  @IsString()
  type!: string;
}
