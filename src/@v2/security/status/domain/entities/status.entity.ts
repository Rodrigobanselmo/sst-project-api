import { updateField } from "@/@v2/shared/domain/helpers/update-field.helper"
import { StatusTypeEnum } from "../../../@shared/domain/enums/status-type.enum"

type IUpdatePrams = {
  name?: string
  color?: string | null
}

export type IStatusEntity = {
  id?: number
  name: string
  companyId: string
  color: string | null
  type: StatusTypeEnum
  deletedAt?: Date | null
}

export class StatusEntity {
  id: number
  name: string
  color: string | null
  companyId: string
  type: StatusTypeEnum
  deletedAt: Date | null

  constructor(params: IStatusEntity) {
    this.id = params.id || -1
    this.name = params.name
    this.color = params.color
    this.companyId = params.companyId
    this.type = params.type
    this.deletedAt = params.deletedAt || null
  }

  delete() {
    this.deletedAt = new Date()
  }

  update(data: IUpdatePrams) {
    this.name = updateField(this.name, data.name)
    this.color = updateField(this.color, data.color)
  }
}