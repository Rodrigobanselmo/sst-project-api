import { IsString } from 'class-validator';

export class BrowseCommentCreatorPath {
  @IsString()
  companyId!: string;
}
