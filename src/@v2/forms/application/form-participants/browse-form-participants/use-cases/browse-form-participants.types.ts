import { FormParticipantsOrderByEnum } from '../controllers/browse-form-participants.query';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { IPagination } from '@/@v2/shared/types/pagination.types';

export namespace IFormParticipantsUseCase {
  export type Params = {
    companyId: string;
    applicationId: string;
    search?: string;
    orderBy?: IOrderBy<FormParticipantsOrderByEnum>;
    pagination: IPagination;
    hierarchyIds?: string[];
    onlyWithEmail?: boolean;
  };
}
