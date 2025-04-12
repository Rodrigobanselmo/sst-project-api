export namespace IAddFormApplicationUseCase {
  export type Params = {
    name: string;
    description?: string;
    companyId: string;
    formId: number;
    workspaceIds: string[];
    hierarchyIds: string[];
    identifier?: {
      name: string;
      description?: string;
      questions: {
        required: boolean;
        order: number;
        questionDataId: number;
      }[];
    };
  };
}
