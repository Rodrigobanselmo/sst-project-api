export interface IAuthUserMailAdapter {
  sendInvite(data: IAuthUserMailAdapter.InviteParams): Promise<void>;
}

export namespace IAuthUserMailAdapter {
  export interface InviteParams {
    companyName: string;
    email: string;
    token: string | null;
  }
}
