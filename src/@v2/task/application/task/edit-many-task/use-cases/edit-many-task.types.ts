export namespace ITaskUseCase {
  export type Params = {
    ids: number[];
    companyId: string;
    description: string | undefined;
    endDate: Date | undefined;
    doneDate: Date | undefined;
    statusId: number | undefined;
    priority: number | undefined;
    projectId: number | undefined;
    responsible: { userId: number }[] | undefined;
    actionPlan: { recommendationId: string; riskDataId: string; workspaceId: string } | undefined;
  };
}
