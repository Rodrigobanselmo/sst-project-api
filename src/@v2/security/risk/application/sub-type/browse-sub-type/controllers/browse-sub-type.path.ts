import { IsString } from 'class-validator';

export class BrowseSubTypePath {
  @IsString()
  companyId!: string;
}
