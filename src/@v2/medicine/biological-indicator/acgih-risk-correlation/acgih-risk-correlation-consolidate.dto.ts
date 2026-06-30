import { Matches } from 'class-validator';

/** Frase de dupla confirmação exigida do MASTER para consolidar os 65 (fix). */
export const ACGIH_RISK_CORRELATION_CONSOLIDATE_CONFIRM_TEXT = 'CONSOLIDAR ACGIH';

/**
 * Total esperado de itens ACGIH/BEI da base homologada na correlação. O endpoint
 * recusa consolidar se o preview não retornar exatamente este total — guarda
 * contra rodar a consolidação sobre uma base incompleta/divergente.
 */
export const ACGIH_RISK_CORRELATION_EXPECTED_TOTAL = 65;

/**
 * Fix — corpo da consolidação completa ACGIH/BEI → indicador oficial. O servidor
 * é autoritativo: reexecuta o preview de correlação (A.1) e a promoção 4P.2; o
 * Client só envia a confirmação literal. Nenhuma seleção/correlação é aceita.
 */
export class AcgihRiskCorrelationConsolidateBody {
  @Matches(
    new RegExp(`^${ACGIH_RISK_CORRELATION_CONSOLIDATE_CONFIRM_TEXT}$`),
    {
      message: `confirmText deve ser exatamente "${ACGIH_RISK_CORRELATION_CONSOLIDATE_CONFIRM_TEXT}".`,
    },
  )
  confirmText!: string;
}
