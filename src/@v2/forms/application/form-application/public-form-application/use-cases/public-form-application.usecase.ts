import { BadRequestException, Injectable } from '@nestjs/common';
import { FormApplicationDAO } from '../../../../database/dao/form-application/form-application.dao';
import { FormApplicationRepository } from '../../../../database/repositories/form-application/form-application.repository';
import { IPublicFormApplicationUseCase } from './public-form-application.types';

@Injectable()
export class PublicFormApplicationUseCase {
  constructor(
    private readonly formApplicationDAO: FormApplicationDAO,
    private readonly formApplicationRepository: FormApplicationRepository,
  ) {}

  async execute(params: IPublicFormApplicationUseCase.Params) {
    const formApplication = await this.formApplicationRepository.find({
      id: params.applicationId,
      companyId: undefined,
    });

    if (!formApplication) {
      throw new BadRequestException('Formulário não encontrado');
    }

    if (!formApplication.canBeAnswered()) {
      return {
        data: null,
        isPublic: false,
        isTesting: false,
      };
    }

    const formApplicationData = await this.formApplicationDAO.readPublic({
      id: params.applicationId,
    });

    if (!formApplicationData) {
      throw new BadRequestException('Formulário não encontrado');
    }

    return {
      data: formApplicationData,
      isPublic: formApplication.isPublic(),
      isTesting: formApplication.isTesting(),
    };
  }
}
