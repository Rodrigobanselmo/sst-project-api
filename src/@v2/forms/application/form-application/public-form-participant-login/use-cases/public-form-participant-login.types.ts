export namespace IPublicFormParticipantLoginUseCase {
  export type Params = {
    applicationId: string;
    cpf: string;
    birthday: string; // yyyy-mm-dd format
  };

  export type Return = {
    id: number;
    name: string;
    cpf: string;
    companyId: string;
  };
}
