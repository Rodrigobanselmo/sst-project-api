import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum HierarchyOrderByEnum {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IHierarchyDAO {
  export type FindTypesParams = {
    companyId: string;
    workspaceId?: string;
  }

  export type BrowseParams = {
    orderBy?: IOrderBy<HierarchyOrderByEnum>;
    filters: {
      companyId: string;
    };
  }
}

