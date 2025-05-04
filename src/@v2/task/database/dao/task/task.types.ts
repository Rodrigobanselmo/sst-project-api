import { IOrderBy } from './../../../../shared/types/order-by.types';

export enum TaskOrderByEnum {
  DESCRIPTION = 'DESCRIPTION',
  STATUS = 'STATUS',
  DONE_DATE = 'DONE_DATE',
  END_DATE = 'END_DATE',
  RESPONSIBLE = 'RESPONSIBLE',
  CREATOR = 'CREATOR',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace ITaskDAO {
  export type ReadParams = {
    id: number;
    companyId: string;
  };

  export type BrowseParams = {
    orderBy?: IOrderBy<TaskOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      creatorsIds?: number[];
      responsibleIds?: number[];
      statusIds?: number[];
      actionPlanIds?: String[];
      projectIds?: number[];
    };
  };
}
