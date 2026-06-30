import { IsBoolean, IsOptional, Matches } from 'class-validator';

export const ACGIH_EXAM_LINK_SYNC_CONFIRM_TEXT = 'VINCULAR EXAMES ACGIH';
export const ACGIH_EXAM_LINK_RESOLVE_CONFIRM_TEXT = 'RESOLVER EXAMES ACGIH';
export const ACGIH_EXAM_LINK_CONFIRM_SAFE_PENDING_TEXT =
  'CONFIRMAR EXAMES ACGIH';

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

/**
 * Resolução em lote do vínculo ACGIH/BEI → Exame. Além de vincular candidatos
 * únicos seguros (linkSafeMatches), pode criar exame sistêmico quando não houver
 * candidato seguro (createMissingExams). Itens ambíguos nunca são resolvidos
 * automaticamente. O servidor é autoritativo (faz o match/criação).
 */
export class AcgihExamLinkResolveBody {
  @Matches(new RegExp(`^${ACGIH_EXAM_LINK_RESOLVE_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${ACGIH_EXAM_LINK_RESOLVE_CONFIRM_TEXT}".`,
  })
  confirmText!: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @IsOptional()
  @IsBoolean()
  createMissingExams?: boolean;

  @IsOptional()
  @IsBoolean()
  linkSafeMatches?: boolean;
}

/**
 * Confirma vínculos ACGIH/BEI → Exame pendentes que passam na regra segura
 * determinante + matriz embutida. O servidor reavalia cada pendente; não cria
 * exame, regra da Biblioteca nem altera risco.
 */
export class AcgihExamLinkConfirmSafePendingBody {
  @Matches(new RegExp(`^${ACGIH_EXAM_LINK_CONFIRM_SAFE_PENDING_TEXT}$`), {
    message: `confirmText deve ser exatamente "${ACGIH_EXAM_LINK_CONFIRM_SAFE_PENDING_TEXT}".`,
  })
  confirmText!: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
