import { CharacterizationOrderByEnum } from "@/@v2/security/database/dao/characterization/characterization.types"
import { IOrderBy } from "@/@v2/shared/types/order-by.types"
import { IPagination } from "@/@v2/shared/types/pagination.types"

export namespace IBrowseCharacterizationUseCase {
  export type Params = {
    companyId: string
    workspaceId: string
    search?: string
    orderBy?: IOrderBy<CharacterizationOrderByEnum>
    pagination: IPagination
    stageIds?: number[]
  }
}
