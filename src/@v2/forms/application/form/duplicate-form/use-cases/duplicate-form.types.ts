export namespace IDuplicateFormUseCase {
  export type Params = {
    companyId: string;
    sourceFormId: string;
  };

  export type Result = {
    id: string;
  };
}
