export namespace IEditTaskService {
  export type Params = {
    id: number;
    companyId: string;
    description: string | undefined;
    endDate: Date | undefined;
    doneDate: Date | undefined;
    statusId: number | undefined;
    priority: number | undefined;
    projectId: number | undefined;
    responsible: { userId: number }[] | undefined;
    photos: { fileId?: string; id?: number; delete?: boolean }[] | undefined;
    actionPlan: { recommendationId: string; riskDataId: string; workspaceId: string } | undefined;
  };
}
