import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { Injectable, Inject } from '@nestjs/common';
import { IFormParticipantsUseCase } from './browse-form-participants.types';
import { CryptoAdapter } from '@/@v2/shared/adapters/crypto/models/crypto.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';

@Injectable()
export class BrowseFormParticipantsUseCase {
  constructor(
    private readonly formParticipantsDAO: FormParticipantsDAO,
    @Inject(SharedTokens.Crypto) private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async execute(params: IFormParticipantsUseCase.Params) {
    const participants = await this.formParticipantsDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        applicationId: params.applicationId,
        search: params.search,
        hierarchyIds: params.hierarchyIds,
        onlyWithEmail: params.onlyWithEmail,
      },
      cryptoAdapter: this.cryptoAdapter,
    });

    return participants;
  }
}
