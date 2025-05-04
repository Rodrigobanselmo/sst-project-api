export type IUserBrowseResultModel = {
  id: number;
  name: string;
  email?: string;
};

export class UserBrowseResultModel {
  id: number;
  name: string;
  email?: string;

  constructor(params: IUserBrowseResultModel) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
  }
}
