import { CoordinatorEntity } from "../../../domain/entities/coordinator.entity";

export interface ICoordinatorRepository {
  findById(params: ICoordinatorRepository.FindByIdParams): ICoordinatorRepository.FindByIdReturn
}

export namespace ICoordinatorRepository {
  export type FindByIdParams = { companyId: string; coordinatorId: number }
  export type FindByIdReturn = Promise<CoordinatorEntity | null>
}