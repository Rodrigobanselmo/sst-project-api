import { IsOptional, IsString } from 'class-validator';

export class BiologicalIndicatorImportPreviewBody {
  @IsOptional()
  @IsString()
  normativeVersion?: string;
}
