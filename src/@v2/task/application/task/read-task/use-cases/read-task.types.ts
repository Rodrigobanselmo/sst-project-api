import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';
import { TaskOrderByEnum } from '@/@v2/task/database/dao/task/task.types';

export namespace IReadTaskUseCase {
  export type Params = {
    companyId: string;
    id: number;
  };
}
