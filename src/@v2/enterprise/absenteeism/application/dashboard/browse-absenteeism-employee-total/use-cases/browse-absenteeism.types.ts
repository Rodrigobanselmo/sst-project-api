import { AbsenteeismEmployeeTotalOrderByEnum } from '@/@v2/enterprise/absenteeism/database/dao/absenteeism-metrics/absenteeism-metrics.types';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IAbsenteeismUseCase {
  export type Params = {
    companyId: string;
    orderBy?: IOrderBy<AbsenteeismEmployeeTotalOrderByEnum>;
    pagination: IPagination;

    search: string | undefined;
    workspacesIds: string[] | undefined;
    hierarchiesIds: string[] | undefined;
    motivesIds: number[] | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
}
