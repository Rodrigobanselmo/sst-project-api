import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';
import { TaskProjectOrderByEnum } from '@/@v2/task/database/dao/task-project/task-project.types';

export namespace IBrowseTaskProjectUseCase {
  export type Params = {
    companyId: string;
    orderBy: IOrderBy<TaskProjectOrderByEnum> | undefined;
    pagination: IPagination;
    search: string | undefined;
    membersIds: number[] | undefined;
  };
}
