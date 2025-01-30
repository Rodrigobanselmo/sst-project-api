import { WorkspaceOrderByEnum } from "@/@v2/enterprise/company/database/dao/workspace/workspace.types"
import { IOrderBy } from "@/@v2/shared/types/order-by.types"

export namespace IBrowseWorkspaceUseCase {
  export type Params = {
    companyId: string
    orderBy?: IOrderBy<WorkspaceOrderByEnum>
  }
}
