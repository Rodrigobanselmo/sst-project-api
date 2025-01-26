import { UserEntity } from '../../domain/entities/user.entity';

export interface IAuthUserMailAdapter {
  sendInvite(data: IAuthUserMailAdapter.InviteParams): Promise<void>;
}

export namespace IAuthUserMailAdapter {
  export type InviteParams = { user: UserEntity; companyId: string };
}
