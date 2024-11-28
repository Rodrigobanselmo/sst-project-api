import { IsString } from 'class-validator';

export class BrowseResponsiblePath {
  @IsString()
  companyId!: string;
}
