import { IsString } from 'class-validator';

export class BrowseGenerateSourcesPath {
  @IsString()
  companyId!: string;
}
