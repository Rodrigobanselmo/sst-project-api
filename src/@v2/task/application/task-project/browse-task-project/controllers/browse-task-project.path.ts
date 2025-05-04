import { IsString } from 'class-validator';

export class BrowseTaskProjectPath {
  @IsString()
  companyId!: string;
}
