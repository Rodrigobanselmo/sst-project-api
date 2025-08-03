import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum FormApplicationOrderByEnum {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  STATUS = 'STATUS',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IFormApplicationDAO {
  export type ReadParams = {
    companyId: string;
    id: string;
  };

  export type ReadPublicParams = {
    id: string;
  };

  export type BrowseParams = {
    orderBy?: IOrderBy<FormApplicationOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      status?: FormStatusEnum[];
    };
  };
}
