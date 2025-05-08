import { TaskProjectStatusEnum } from '@/@v2/task/domain/enums/task-project-status.enum';

export namespace ITaskProjectUseCase {
  export type Params = {
    id: number;
    companyId: string;
    name?: string;
    description?: string;
    members?: { id?: number; userId: number; delete?: boolean }[];
    status?: TaskProjectStatusEnum;
  };
}
