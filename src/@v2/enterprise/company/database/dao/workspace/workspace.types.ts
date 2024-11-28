import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum WorkspaceOrderByEnum {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IWorkspaceDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<WorkspaceOrderByEnum>;
    filters: {
      companyId: string;
    };
  }
}

