import { IsString } from 'class-validator';

export class SendFormReminderPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
