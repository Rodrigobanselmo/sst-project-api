import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum GenerateSourceOrderByEnum {
  NAME = 'NAME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace IGenerateSourceDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<GenerateSourceOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      companyId: string;
      search?: string;
      riskIds?: string[];
    };
  };
}
