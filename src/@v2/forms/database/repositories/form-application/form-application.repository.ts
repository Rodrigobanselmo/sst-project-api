import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFormApplicationRepository } from './form-application.types';
import { FormApplicationEntityMapper } from '../../mappers/entities/form-application.mapper';
import { FormStatusEnum } from '@/@v2/forms/domain/enums/form-status.enum';
import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';

@Injectable()
export class FormApplicationRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.FormApplicationFindFirstArgs['include'];

    return { include };
  }

  async find(params: IFormApplicationRepository.FindParams): IFormApplicationRepository.FindReturn {
    const formApplicationEntity = await this.prisma.formApplication.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
        deleted_at: null,
      },
    });

    return formApplicationEntity ? FormApplicationEntityMapper.toEntity(formApplicationEntity) : null;
  }

  async delete(params: IFormApplicationRepository.DeleteParams): Promise<boolean> {
    const deleted = await this.prisma.formApplication.update({
      where: {
        id: params.id,
        company_id: params.companyId,
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
