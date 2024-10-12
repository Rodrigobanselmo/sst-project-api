import { StatusTypeEnum } from "@/@v2/security/domain/enums/status-type.enum"

export namespace IBrowseStatusUseCase {
  export type Params = {
    companyId: string
    type?: StatusTypeEnum
  }
}
