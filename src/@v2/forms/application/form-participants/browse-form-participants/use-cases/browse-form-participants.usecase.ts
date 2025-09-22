import { FormParticipantsDAO } from '@/@v2/forms/database/dao/form-participants/form-participants.dao';
import { Injectable } from '@nestjs/common';
import { IFormParticipantsUseCase } from './browse-form-participants.types';

@Injectable()
export class BrowseFormParticipantsUseCase {
  constructor(private readonly formParticipantsDAO: FormParticipantsDAO) {}

  async execute(params: IFormParticipantsUseCase.Params) {
    const participants = await this.formParticipantsDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        applicationId: params.applicationId,
        search: params.search,
      },
    });

    return participants;
  }
}
