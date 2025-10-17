import { IsString } from 'class-validator';

export class AiAnalyzeCharacterizationPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  characterizationId!: string;
}
