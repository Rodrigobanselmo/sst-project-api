import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFormApplicationRepository } from './form-application.types';
import { FormApplicationEntityMapper } from '../../mappers/entities/form-application.mapper';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';
import { formApplicationAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';

@Injectable()
export class FormApplicationRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.FormApplicationFindFirstArgs['include'];

    return { include };
  }

  async find(params: IFormApplicationRepository.FindParams): IFormApplicationRepository.FindReturn {
    const formApplicationEntity = await this.prisma.formApplication.findFirst({
      where: formApplicationAccessWhere({
        formApplicationId: params.id,
        accessCompanyId: params.companyId,
      }),
    });

    return formApplicationEntity ? FormApplicationEntityMapper.toEntity(formApplicationEntity) : null;
  }

  async delete(params: IFormApplicationRepository.DeleteParams): Promise<boolean> {
    const existing = await this.prisma.formApplication.findFirst({
      where: formApplicationAccessWhere({
        formApplicationId: params.id,
        accessCompanyId: params.companyId,
      }),
      select: { id: true, company_id: true },
    });

    if (!existing) return false;

    const deleted = await this.prisma.formApplication.update({
      where: {
        id: existing.id,
        company_id: existing.company_id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: {
        id: true,
      },
    });

    return !!deleted;
  }
}
