import { isValidEmail } from '@/@v2/shared/utils/helpers/is-valid-email';

export type IUserEntity = {
  id?: number;
  email?: string | null;
  name?: string | null;
  password?: string | null;
  googleExternalId?: string | null;
  cpf?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  token?: string | null;
};

export class UserEntity {
  id: number;
  #email: string | null;
  name: string | null;
  password: string | null;
  googleExternalId: string | null;
  cpf: string | null;
  photoUrl: string | null;
  phone: string | null;
  token: string | null;

  constructor(params: IUserEntity) {
    this.id = params.id || -1;
    this.name = params.name || null;
    this.#email = params.email || null;
    this.password = params.password || null;
    this.googleExternalId = params.googleExternalId || null;
    this.cpf = params.cpf || null;
    this.photoUrl = params.photoUrl || null;
    this.phone = params.phone || null;
    this.token = params.token || null;
  }

  get email() {
    return this.#email;
  }

  setEmail(email: string) {
    const isValid = isValidEmail(email);
    this.#email = isValid ? email : this.#email;

    return isValid;
  }

  get hasAccess() {
    return this.googleExternalId || this.password;
  }
}
