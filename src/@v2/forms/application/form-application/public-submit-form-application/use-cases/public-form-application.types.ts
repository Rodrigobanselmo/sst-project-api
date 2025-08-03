export namespace ISubmitFormApplicationUseCase {
  export type Params = {
    applicationId: string;
    answers: {
      questionId: string;
      value?: string;
      optionId?: string;
    }[];
    employeeId?: number;
  };
}
