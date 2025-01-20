import { updateField } from '@/@v2/shared/domain/helpers/update-field.helper';

export type IUserEntity = {
  id?: number;
  email: string;
  name?: string | null;
  password?: string | null;
  cpf?: string | null;
  phone?: string | null;
};

export class UserEntity {
  id: number;
  email: string;
  name: string | null;
  password: string | null;
  cpf: string | null;
  phone: string | null;

  constructor(params: IUserEntity) {
    this.id = params.id || -1;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.cpf = params.cpf;
    this.phone = params.phone;
  }
}
