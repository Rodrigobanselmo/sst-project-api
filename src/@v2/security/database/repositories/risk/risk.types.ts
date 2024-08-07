import { RiskAggregate } from "@/@v2/security/domain/aggregate/risk.aggregate";

export namespace IRiskRepository {
  export type FindByIdParams = { id: string; companyId: string }
  export type FindByIdReturn = Promise<RiskAggregate | null>
}