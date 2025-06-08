import { config } from '@/@v2/shared/constants/config';

export type IUserModel = {
  id: number;
  email: string;
  name: string;
  token: string | undefined;
  isActive: boolean;
};

export class UserModel {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  token?: string;

  constructor(params: IUserModel) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.token = params.token;
    this.isActive = params.isActive;
  }

  getLink(path?: string): string {
    if (this.token && !this.isActive) return `${config.SYSTEM.APP_HOST}/cadastro/?token=${this.token}&email=${this.email}`;
    return `${config.SYSTEM.APP_HOST}${path || ''}`;
  }
}
