import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

/** Frase de dupla confirmação exigida do MASTER para promover (4P.2A). */
export const ACGIH_PROMOTION_APPLY_CONFIRM_TEXT = 'PROMOVER ACGIH';

/** Limite máximo de itens por requisição de apply (4P.2A). */
export const ACGIH_PROMOTION_APPLY_MAX_ITEMS = 200;

/**
 * 4P.2A — corpo do apply/promote de candidatos ACGIH/BEI a indicador oficial.
 * O servidor é autoritativo: reexecuta o preview e ignora qualquer payload
 * proposto vindo do Client. Aqui só chegam: a seleção de ids, o opt-in de
 * divergência e a confirmação textual.
 */
export class AcgihPromotionApplyBody {
  // Se omitido/vazio, aplica todos os ELIGIBLE do preview (até o limite).
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(ACGIH_PROMOTION_APPLY_MAX_ITEMS)
  @IsString({ each: true })
  acgihBeiIndicatorIds?: string[];

  // Mesma semântica do preview: inclui candidatos derivados de divergência real.
  @IsOptional()
  @IsBoolean()
  includeDivergenceDerived?: boolean;

  // Dupla confirmação literal obrigatória.
  @Matches(new RegExp(`^${ACGIH_PROMOTION_APPLY_CONFIRM_TEXT}$`), {
    message: `confirmText deve ser exatamente "${ACGIH_PROMOTION_APPLY_CONFIRM_TEXT}".`,
  })
  confirmText!: string;
}
