import { StatusEntity } from "@/@v2/security/domain/entities/status.entity";

export namespace IStatusRepository {
  export type CreateParams = StatusEntity
  export type CreateReturn = Promise<StatusEntity | null>

  export type UpdateParams = StatusEntity
  export type UpdateReturn = Promise<StatusEntity | null>

  export type FindParams = { id: number, companyId: string }
  export type FindReturn = Promise<StatusEntity | null>
}