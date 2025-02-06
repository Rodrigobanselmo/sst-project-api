import { DocumentControlOrderByEnum } from '@/@v2/enterprise/document-control/database/dao/document-control/document-control.types';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IDocumentControlUseCase {
  export type Params = {
    companyId: string;
    workspaceId: string;
    search?: string;
    orderBy?: IOrderBy<DocumentControlOrderByEnum>;
    pagination: IPagination;
  };
}
