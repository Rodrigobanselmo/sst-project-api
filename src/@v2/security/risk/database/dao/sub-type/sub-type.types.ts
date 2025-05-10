import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';

export enum SubTypeOrderByEnum {
  NAME = 'NAME',
  TYPE = 'TYPE',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
}

export namespace ISubTypeDAO {
  export type BrowseParams = {
    orderBy?: IOrderBy<SubTypeOrderByEnum>;
    limit?: number;
    page?: number;
    filters: {
      search?: string;
      types?: RiskTypeEnum[];
    };
  };
}
