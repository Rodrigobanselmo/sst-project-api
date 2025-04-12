import { BadRequestException, Injectable } from '@nestjs/common';
import { FormApplicationDAO } from '../../../../database/dao/form-application/form-application.dao';
import { IFormApplicationUseCase } from './read-form-application.types';

@Injectable()
export class ReadFormApplicationUseCase {
  constructor(private readonly formApplicationDAO: FormApplicationDAO) {}

  async execute(params: IFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationDAO.read({
      id: params.applicationId,
      companyId: params.companyId,
    });

    if (!formApplication) throw new BadRequestException('Formulário não encontrado');

    return formApplication;
  }
}
