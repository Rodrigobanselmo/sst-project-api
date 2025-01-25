import { UserStatusEnum } from '../../enums/user-status.enum';

export type IUserBrowseResultModel = {
  id: string;
  email: string;
  name: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatusEnum;
};

export class UserBrowseResultModel {
  id: string;
  email: string;
  name: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatusEnum;

  constructor(params: IUserBrowseResultModel) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.status = params.status;
  }
}
