import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class ConvertWorkspaceToCompanyPath {
  @IsString()
  companyId!: string;

  @IsString()
  workspaceId!: string;
}

export class ConvertWorkspaceToCompanyPreviewQuery {
  @Type(() => Number)
  @IsInt()
  companyGroupId!: number;
}

export class ConvertWorkspaceToCompanyPayload {
  @Type(() => Number)
  @IsInt()
  companyGroupId!: number;

  @IsString()
  confirmationText!: string;
}
