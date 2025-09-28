import { FormParticipantsOrderByEnum } from '@/@v2/forms/application/form-participants/browse-form-participants/controllers/browse-form-participants.query';
import { IOrderBy } from '@/@v2/shared/types/order-by.types';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';

export namespace IFormParticipantsDAO {
  export type BrowseParams = {
    page?: number;
    limit?: number;
    orderBy?: IOrderBy<FormParticipantsOrderByEnum>;
    filters: {
      companyId: string;
      applicationId: string;
      search?: string;
      hierarchyIds?: string[];
      participantIds?: number[];
      onlyWithEmail?: boolean;
    };
    cryptoAdapter: CryptoAdapter;
  };
}
