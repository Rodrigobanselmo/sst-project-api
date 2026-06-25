import {
  IsBooleanString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export const BIOLOGICAL_INDICATOR_APPLY_CONFIRM_TEXT = 'APLICAR NR07';

export class BiologicalIndicatorImportPreviewBody {
  @IsOptional()
  @IsString()
  normativeVersion?: string;
}

export class BiologicalIndicatorImportApplyBody {
  @IsOptional()
  @IsString()
  normativeVersion?: string;

  /** Multipart sends booleans as strings — must be the literal "true". */
  @IsBooleanString()
  confirmApply!: string;

  /** Double-confirmation phrase the MASTER must type verbatim. */
  @Matches(new RegExp(`^${BIOLOGICAL_INDICATOR_APPLY_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${BIOLOGICAL_INDICATOR_APPLY_CONFIRM_TEXT}".`,
  })
  confirmText!: string;
}
