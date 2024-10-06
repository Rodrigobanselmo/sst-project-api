import { IsOptional, IsString } from 'class-validator';

export class EditStatusPayload {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  color?: string | null;
}


