import { IsBoolean, IsOptional, Matches } from 'class-validator';

export const EXAM_RISK_RULE_SYNC_ACGIH_CONFIRM_TEXT = 'SINCRONIZAR ACGIH';

/**
 * Sincronização ACGIH/BEI → Biblioteca Risco × Exame. O servidor é autoritativo;
 * o Client envia apenas confirmação literal e opt-in de simulação (dryRun).
 */
export class ExamRiskRuleSyncAcgihBody {
  @Matches(new RegExp(`^${EXAM_RISK_RULE_SYNC_ACGIH_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${EXAM_RISK_RULE_SYNC_ACGIH_CONFIRM_TEXT}".`,
  })
  confirmText!: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
