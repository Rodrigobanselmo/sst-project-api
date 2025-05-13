import { IOrderBy } from '../../../../shared/types/order-by.types';

export enum TaskProjectOrderByEnum {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  STATUS = 'STATUS',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace ITaskProjectDAO {
  export type ReadParams = {
    id: number;
    companyId: string;
  };

  export type BrowseParams = {
    orderBy?: IOrderBy<TaskProjectOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      membersIds?: number[];
    };
  };
}
