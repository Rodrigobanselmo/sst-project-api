import { FormApplicationOrderByEnum } from '@/@v2/forms/database/dao/form-application/form-application.types';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IFormApplicationUseCase {
  export type Params = {
    companyId: string;
    search?: string;
    status?: FormStatusEnum[];
    orderBy?: IOrderBy<FormApplicationOrderByEnum>;
    pagination: IPagination;
  };
}
