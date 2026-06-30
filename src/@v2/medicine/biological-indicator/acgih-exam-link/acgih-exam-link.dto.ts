import { IsBoolean, IsOptional, Matches } from 'class-validator';

export const ACGIH_EXAM_LINK_SYNC_CONFIRM_TEXT = 'VINCULAR EXAMES ACGIH';

/**
 * Vínculo ACGIH/BEI → Exame. O servidor é autoritativo; o Client envia apenas a
 * confirmação literal e o opt-in de simulação (dryRun).
 */
export class AcgihExamLinkSyncBody {
  @Matches(new RegExp(`^${ACGIH_EXAM_LINK_SYNC_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${ACGIH_EXAM_LINK_SYNC_CONFIRM_TEXT}".`,
  })
  confirmText!: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
