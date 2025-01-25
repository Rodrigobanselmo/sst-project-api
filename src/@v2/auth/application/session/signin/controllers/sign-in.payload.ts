import { IsOptional, IsString } from 'class-validator';

export class SignInPayload {
  @IsString()
  token!: string;

  @IsString()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  password?: string | null;

  @IsString()
  @IsOptional()
  googleToken?: string | null;
}
