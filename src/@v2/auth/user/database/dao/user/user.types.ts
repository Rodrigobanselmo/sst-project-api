import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum UserOrderByEnum {
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IUserDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<UserOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
    };
  };

  export type CheckIfExistParams = {
    email: string;
  };
}
