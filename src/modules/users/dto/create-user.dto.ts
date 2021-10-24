import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'user name.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'user email.' })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'user password.' })
  @IsString()
  password: string;

  @ApiProperty({ example: ['admin'] })
  @IsString({ each: true })
  readonly roles: string[];

  @ApiProperty({ example: ['user.list'] })
  @IsString({ each: true })
  readonly permissions: string[];

  @ApiProperty({ description: 'user avatar.' })
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}
