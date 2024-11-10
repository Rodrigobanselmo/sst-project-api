import { ActionPlanOrderByEnum } from "@/@v2/security/action-plan/database/dao/action-plan/action-plan.types"
import { IOrderBy } from "@/@v2/shared/types/order-by.types"
import { IPagination } from "@/@v2/shared/types/pagination.types"

export namespace IBrowseActionPlanUseCase {
  export type Params = {
    companyId: string
    workspaceIds?: string[]
    search?: string
    orderBy?: IOrderBy<ActionPlanOrderByEnum>
    pagination: IPagination
    stageIds?: number[]
  }
}
