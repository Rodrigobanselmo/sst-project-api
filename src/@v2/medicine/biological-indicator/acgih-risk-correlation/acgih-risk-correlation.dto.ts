import { IsOptional, IsString } from 'class-validator';

/**
 * Frente A.1 — query do preview (somente leitura) da correlação ACGIH/BEI ×
 * Fatores de Risco. `search` é um filtro textual opcional (nome/CAS/determinante).
 */
export class AcgihRiskCorrelationPreviewQuery {
  @IsOptional()
  @IsString()
  search?: string;
}
