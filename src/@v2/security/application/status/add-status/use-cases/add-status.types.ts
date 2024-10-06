import { StatusTypeEnum } from "@/@v2/security/domain/enums/status-type.enum"

export namespace IStatusUseCase {
  export type Params = {
    name: string
    companyId: string
    type: StatusTypeEnum
    color?: string | null
  }
}
