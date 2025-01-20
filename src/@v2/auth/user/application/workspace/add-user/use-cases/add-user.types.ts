export namespace IAddUserUseCase {
  export type Params = {
    companyId: string;
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
    groupId: number;
  };
}
