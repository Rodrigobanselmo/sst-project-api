import { HierarchyOrderByEnum } from "@/@v2/security/action-plan/database/dao/hierarchy/hierarchy.types"
import { IOrderBy } from "@/@v2/shared/types/order-by.types"
import { IPagination } from "@/@v2/shared/types/pagination.types"

export namespace IBrowseHierarchiesUseCase {
  export type Params = {
    companyId: string
    workspaceIds?: string[]
    orderBy?: IOrderBy<HierarchyOrderByEnum>
    pagination: IPagination
    search?: string;
  }
}
