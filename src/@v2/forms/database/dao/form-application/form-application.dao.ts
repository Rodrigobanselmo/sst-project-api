import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { FormApplicationReadModelMapper, IFormApplicationReadModelMapper } from '../../mappers/models/form-application/form-application-read.mapper';
import { IFormApplicationDAO } from './form-application.types';

@Injectable()
export class FormApplicationDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read(params: IFormApplicationDAO.ReadParams) {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      include: {},
    });

    return formApplication[0]?.id ? FormApplicationReadModelMapper.toModel(formApplication) : null;
  }
}
