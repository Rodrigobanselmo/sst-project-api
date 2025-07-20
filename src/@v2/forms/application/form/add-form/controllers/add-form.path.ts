import { IsString } from 'class-validator';

export class AddFormPath {
  @IsString()
  companyId!: string;
}
