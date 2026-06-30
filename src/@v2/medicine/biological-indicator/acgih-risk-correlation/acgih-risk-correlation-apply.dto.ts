import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

/** Frase de dupla confirmação exigida do MASTER para aplicar os vínculos (A.3). */
export const ACGIH_RISK_CORRELATION_APPLY_CONFIRM_TEXT = 'VINCULAR ACGIH RISCOS';

/** Limite máximo de itens por requisição de apply (A.3). */
export const ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS = 100;

/**
 * Frente A.3 — corpo do apply da correlação ACGIH/BEI × Fatores de Risco. O
 * servidor é autoritativo: reexecuta o preview (A.1) e ignora qualquer
 * correlação vinda do Client. Aqui só chegam: seleção opcional de ids, opt-in de
 * simulação (dryRun) e a confirmação textual obrigatória.
 */
export class AcgihRiskCorrelationApplyBody {
  // Se omitido/vazio, aplica todos os itens elegíveis do preview (até o limite).
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(ACGIH_RISK_CORRELATION_APPLY_MAX_ITEMS)
  @IsString({ each: true })
  acgihBeiIndicatorIds?: string[];

  // true => simula (não grava nada) e retorna o mesmo formato de resultado.
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  // Dupla confirmação literal obrigatória.
  @Matches(new RegExp(`^${ACGIH_RISK_CORRELATION_APPLY_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${ACGIH_RISK_CORRELATION_APPLY_CONFIRM_TEXT}".`,
  })
  confirmText!: string;
}
