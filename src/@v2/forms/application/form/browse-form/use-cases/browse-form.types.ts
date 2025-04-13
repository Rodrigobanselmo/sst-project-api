import { FormOrderByEnum } from '@/@v2/forms/database/dao/form/form.types';
import { FormTypeEnum } from '@/@v2/forms/domain/enums/form-type.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IFormUseCase {
  export type Params = {
    companyId: string;
    search?: string;
    types?: FormTypeEnum[];
    orderBy?: IOrderBy<FormOrderByEnum>;
    pagination: IPagination;
  };
}
