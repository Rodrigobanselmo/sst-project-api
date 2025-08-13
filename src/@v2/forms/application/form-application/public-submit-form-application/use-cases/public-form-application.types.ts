export namespace ISubmitFormApplicationUseCase {
  export type Params = {
    applicationId: string;
    employeeId?: number;
    answers: {
      questionId: string;
      value?: string;
      optionIds?: string[];
    }[];
  };
}
