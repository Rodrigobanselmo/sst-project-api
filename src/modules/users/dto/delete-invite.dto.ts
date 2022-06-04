import { IsEmail, IsString } from 'class-validator';

export class DeleteInviteDto {
  @IsString()
  @IsEmail()
  readonly id: string;

  @IsString()
  readonly companyId: string;
}
