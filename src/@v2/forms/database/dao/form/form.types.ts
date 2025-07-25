import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum FormOrderByEnum {
  NAME = 'NAME',
  TYPE = 'TYPE',
  DESCRIPTION = 'DESCRIPTION',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IFormDAO {
  export type ReadParams = {
    companyId: string;
    id: string;
  };

  export type BrowseParams = {
    orderBy?: IOrderBy<FormOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      types?: string[];
    };
  };
}
