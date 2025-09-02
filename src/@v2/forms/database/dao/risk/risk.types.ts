import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum RiskOrderByEnum {
  NAME = 'NAME',
  SEVERITY = 'SEVERITY',
  TYPE = 'TYPE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IRiskDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<RiskOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
    };
  };
}
