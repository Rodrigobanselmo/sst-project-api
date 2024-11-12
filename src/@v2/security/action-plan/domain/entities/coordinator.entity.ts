
export type ICoordinatorEntity = {
  id: number;
}

export class CoordinatorEntity {
  id: number

  constructor(params: ICoordinatorEntity) {
    this.id = params.id
  }

}