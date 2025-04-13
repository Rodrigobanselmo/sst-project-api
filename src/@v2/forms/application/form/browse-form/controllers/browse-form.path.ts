import { IsString } from 'class-validator';

export class BrowseFormPath {
  @IsString()
  companyId!: string;
}
