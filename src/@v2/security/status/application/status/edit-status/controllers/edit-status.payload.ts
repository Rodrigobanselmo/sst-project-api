import { IsOptional, IsString } from 'class-validator';

export class EditStatusPayload {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  color?: string | null;
}


