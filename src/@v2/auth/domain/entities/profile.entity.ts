import { AccessGroupEntity } from './access-group.entity';

export type IProfileEntity = {
  companyId: string;
  userId: number;
  accessGroup: AccessGroupEntity | null;
};

export class ProfileEntity {
  uuid: { companyId: string; userId: number };
  accessGroup: AccessGroupEntity | null;

  constructor(params: IProfileEntity) {
    this.uuid = { companyId: params.companyId, userId: params.userId };
    this.accessGroup = params.accessGroup;
  }

  get new() {
    return this.uuid.userId === -1;
  }
}
