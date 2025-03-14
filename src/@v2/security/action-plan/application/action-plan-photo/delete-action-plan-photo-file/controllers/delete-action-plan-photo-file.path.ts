import { IsString } from 'class-validator';

export class DeleteFilePath {
  @IsString()
  companyId!: string;

  @IsString()
  photoId!: string;
}
