import { BadRequestException, Injectable } from '@nestjs/common';
import { FormDAO } from '../../../../database/dao/form/form.dao';
import { IFormUseCase } from './read-form.types';

@Injectable()
export class ReadFormUseCase {
  constructor(private readonly formDAO: FormDAO) {}

  async execute(params: IFormUseCase.Params) {
    const form = await this.formDAO.read({
      id: params.formId,
      companyId: params.companyId,
    });

    if (!form) throw new BadRequestException('Modelo de Formulário não encontrado');

    return form;
  }
}
