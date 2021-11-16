import { IsEmail, IsString, IsNumber } from 'class-validator';

export class InviteUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNumber()
  readonly companyId: number;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}
