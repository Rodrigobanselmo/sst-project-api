import { IsString } from 'class-validator';

export class BrowseCoordinatorPath {
  @IsString()
  companyId!: string;
}
