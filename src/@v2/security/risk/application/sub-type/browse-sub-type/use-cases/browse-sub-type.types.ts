import { SubTypeOrderByEnum } from '@/@v2/security/risk/database/dao/sub-type/sub-type.types';
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';
import { StatusEnum } from '@prisma/client';

export namespace ISubTypeUseCase {
  export type Params = {
    search?: string;
    types?: RiskTypeEnum[];
    status?: StatusEnum;
    orderBy?: IOrderBy<SubTypeOrderByEnum>;
    pagination: IPagination;
  };
}
