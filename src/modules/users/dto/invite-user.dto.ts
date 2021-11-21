import { IsEmail, IsString } from 'class-validator';

export class InviteUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly companyId: string;

  @IsString({ each: true })
  readonly roles: string[];

  @IsString({ each: true })
  readonly permissions: string[];
}
