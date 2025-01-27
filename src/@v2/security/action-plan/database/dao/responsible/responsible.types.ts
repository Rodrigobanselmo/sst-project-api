import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum ResponsibleOrderByEnum {
  NAME = 'NAME',
}

export namespace IResponsibleDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<ResponsibleOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
    };
  };
}
