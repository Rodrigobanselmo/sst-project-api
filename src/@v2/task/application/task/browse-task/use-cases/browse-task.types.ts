import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';
import { TaskOrderByEnum } from '@/@v2/task/database/dao/task/task.types';

export namespace IBrowseTaskUseCase {
  export type Params = {
    companyId: string;
    orderBy: IOrderBy<TaskOrderByEnum> | undefined;
    pagination: IPagination;
    search: string | undefined;
    creatorsIds: number[] | undefined;
    responsibleIds: number[] | undefined;
    statusIds: number[] | undefined;
    projectIds: number[] | undefined;
    actionPlanIds: String[] | undefined;
    isExpired: boolean | null | undefined;
    priorities: number[] | undefined;
  };
}
