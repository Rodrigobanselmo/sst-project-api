import { IOrderBy } from "@/@v2/shared/types/order-by.types";

export enum UserOrderByEnum {
  NAME = 'NAME',
}

export namespace IUserDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<UserOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
    };
  }
}

