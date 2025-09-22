import { IsString } from 'class-validator';

export class BrowseFormParticipantsPath {
  @IsString()
  companyId!: string;

  @IsString()
  applicationId!: string;
}
