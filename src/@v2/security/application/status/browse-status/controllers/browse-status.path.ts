import { IsString } from 'class-validator';

export class BrowseStatusPath {
  @IsString()
  companyId!: string;
}
