import { CoordinatorEntity } from "../../../domain/entities/coordinator.entity"

export type ICoordinatorMapper = {
  id: number
}
export class CoordinatorMapper {
  static toEntity(prisma: ICoordinatorMapper): CoordinatorEntity {
    return new CoordinatorEntity({
      id: prisma.id,
    })
  }
}