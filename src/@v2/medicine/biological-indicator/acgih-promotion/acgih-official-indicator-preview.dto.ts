import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * 4P.1B — query do preview/dry-run de promoção ACGIH/BEI → indicador oficial.
 * Somente leitura. `includeDivergenceDerived` chega como string no querystring.
 */
export class AcgihPromotionPreviewQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  // 'true' inclui também candidatos derivados de divergência técnica real.
  @IsOptional()
  @IsIn(['true', 'false'])
  includeDivergenceDerived?: 'true' | 'false';
}
