import { StatusTypeEnum } from "@/@v2/security/domain/enums/status-type.enum"

export namespace IStatusDAO {
  export type BrowseParams = {
    companyId: string
    type?: StatusTypeEnum
  }

  export type CheckIfExistParams = {
    companyId: string
    name: string
  }
}

