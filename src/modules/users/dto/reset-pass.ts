import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8)
  @MaxLength(20)
  @IsString()
  password: string;

  @IsString()
  tokenId: string;
}
