import { RiskAggregation } from "@/@v2/security/domain/aggregations/risk.aggregation";

export namespace IRiskRepository {
  export type FindByIdParams = { id: string; companyId: string }
  export type FindByIdReturn = Promise<RiskAggregation | null>
}