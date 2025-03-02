import { IsString } from 'class-validator';

export class FindOriginPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  recommendationId!: string;

  @IsString()
  id!: string;
}
