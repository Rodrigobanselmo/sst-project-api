import { IsString } from 'class-validator';

export class EditCommentPath {
  @IsString()
  companyId!: string;
}
