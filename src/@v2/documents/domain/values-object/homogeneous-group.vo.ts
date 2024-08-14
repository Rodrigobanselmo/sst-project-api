import { HomoTypeEnum } from "@/@v2/shared/domain/enum/security/homo-type.enum";

export type IHomogeneousGroupVO = {
  name: string
  type: HomoTypeEnum;
}

export class HomogeneousGroupVO {
  name: string
  type: HomoTypeEnum;

  constructor(params: IHomogeneousGroupVO) {
    this.name = params.name
    this.type = params.type;
  }
}