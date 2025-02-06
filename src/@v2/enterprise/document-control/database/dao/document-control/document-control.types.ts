import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum DocumentControlOrderByEnum {
  NAME = 'NAME',
  TYPE = 'TYPE',
  DESCRIPTION = 'DESCRIPTION',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IDocumentControlDAO {
  export type ReadParams = {
    companyId: string;
    id: number;
  };

  export type BrowseParams = {
    orderBy?: IOrderBy<DocumentControlOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      workspaceId: string;
      search?: string;
    };
  };
}
