import { IsString } from 'class-validator';

export class BrowseTaskPath {
  @IsString()
  companyId!: string;
}
