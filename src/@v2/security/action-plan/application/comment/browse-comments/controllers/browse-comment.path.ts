import { IsString } from 'class-validator';

export class BrowseCommentsPath {
  @IsString()
  companyId!: string;
}
