import { IsString } from 'class-validator';

export class BrowseAbsenteeismPath {
  @IsString()
  companyId!: string;
}
