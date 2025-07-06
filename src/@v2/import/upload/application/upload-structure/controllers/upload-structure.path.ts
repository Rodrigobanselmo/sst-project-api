import { IsString } from 'class-validator';

export class UploadStructurePath {
  @IsString()
  companyId!: string;
}
