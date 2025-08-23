export namespace ISubmitFormApplicationUseCase {
  export type Params = {
    applicationId: string;
    employeeId?: number;
    timeSpent?: number;
    answers: {
      questionId: string;
      value?: string;
      optionIds?: string[];
    }[];
  };
}
