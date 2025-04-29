export namespace ITaskUseCase {
  export type Params = {
    companyId: string;
    description: string;
    endDate: Date | undefined;
    doneDate: Date | undefined;
    statusId: number | undefined;
    projectId: number | undefined;
    responsible: { userId: number }[] | undefined;
    photos: { fileId: string }[] | undefined;
    actionPlan: { recommendationId: string; riskDataId: string; workspaceId: string } | undefined;
  };
}
