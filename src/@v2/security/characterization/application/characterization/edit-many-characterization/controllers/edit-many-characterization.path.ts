import { IsString } from 'class-validator';

export class EditCharacterizationPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}
