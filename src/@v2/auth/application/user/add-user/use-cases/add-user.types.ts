export namespace IAddUserUseCase {
  export type Params = {
    companyId: string;
    name: string;
    email?: string;
    cpf?: string;
    phone?: string;
    employeeId?: number;
    groupId: number;
    companiesIds?: string[];
  };

  export type Result = {
    id: number;
  };
}
