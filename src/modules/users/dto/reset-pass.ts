import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'user new password' })
  @MinLength(8)
  @MaxLength(20)
  @IsString()
  password: string;

  @ApiProperty({ description: 'user token id received on email' })
  @IsString()
  tokenId: string;
}
