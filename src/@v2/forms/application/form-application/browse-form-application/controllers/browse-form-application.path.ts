import { IsString } from 'class-validator';

export class BrowseFormApplicationPath {
  @IsString()
  companyId!: string;
}
