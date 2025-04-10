import { IStorageAdapter } from '@/@v2/shared/adapters/storage/storage.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FormApplicationDAO } from '../../../../database/dao/form-application/form-application.dao';
import { IFormApplicationUseCase } from './read-form-application.types';

@Injectable()
export class ReadFormApplicationUseCase {
  constructor(
    @Inject(SharedTokens.Storage) private readonly storage: IStorageAdapter,
    private readonly formApplicationDAO: FormApplicationDAO,
  ) {}

  async execute(params: IFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationDAO.read({
      id: params.applicationId,
      companyId: params.companyId,
    });

    if (!formApplication) throw new BadRequestException('Documento não encontrado');

    return formApplication;
  }
}
