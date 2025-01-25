export namespace ISigninUseCase {
  export type Params = {
    token: string;
    email?: string;
    password?: string;
    googleToken?: string;
  };
}
