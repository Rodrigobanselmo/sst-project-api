import { IsString } from 'class-validator';

export class BrowseRisksPath {
  @IsString()
  companyId!: string;
}
