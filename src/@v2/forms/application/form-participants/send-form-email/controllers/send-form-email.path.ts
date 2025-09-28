import { IsString, IsUUID } from 'class-validator';

export class SendFormEmailPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
