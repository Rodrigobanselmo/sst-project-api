import { StatusEnum } from '@prisma/client';

type PgrRecommendationStatusRow = {
  status: StatusEnum;
  recMedId?: string;
  recommendationId?: string;
};

/**
 * PGR document output: hide recommendations whose action-plan link (RiskFactorDataRec) is
 * concluded (DONE) or canceled (CANCELED). Missing link rows keep prior behavior (still listed).
 */
export function shouldHideRecommendationInPgr(
  dataRecs: PgrRecommendationStatusRow[] | undefined | null,
  recMedId: string,
): boolean {
  const row = dataRecs?.find((d) => (d.recMedId ?? d.recommendationId) === recMedId);
  return row?.status === StatusEnum.DONE || row?.status === StatusEnum.CANCELED;
}
