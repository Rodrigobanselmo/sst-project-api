import { IsString } from 'class-validator';

export class AddFilePath {
  @IsString()
  companyId!: string;
}
