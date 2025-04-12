import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IFormRepository } from './form.types';
import { FormEntityMapper } from '../../mappers/entities/form.mapper';

@Injectable()
export class FormRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {} satisfies Prisma.FormFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormRepository.CreateParams): IFormRepository.CreateReturn {
    const formEntity = await this.prisma.form.create({
      data: {
        name: params.name,
        company_id: params.companyId,
        type: params.type,
        description: params.description,
        anonymous: params.anonymous,
        shareable_link: params.shareableLink,
        system: params.system,
      },
    });

    return formEntity ? FormEntityMapper.toEntity(formEntity) : null;
  }

  async update(params: IFormRepository.UpdateParams): IFormRepository.UpdateReturn {
    const formEntity = await this.prisma.form.update({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      data: {
        name: params.name,
        type: params.type,
        description: params.description,
        anonymous: params.anonymous,
        shareable_link: params.shareableLink,
      },
    });

    return formEntity ? FormEntityMapper.toEntity(formEntity) : null;
  }

  async find(params: IFormRepository.FindParams): IFormRepository.FindReturn {
    const formEntity = await this.prisma.form.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            company_id: params.companyId,
          },
          {
            system: true,
          },
        ],
      },
    });

    return formEntity ? FormEntityMapper.toEntity(formEntity) : null;
  }

  async delete(params: IFormRepository.DeleteParams): Promise<boolean> {
    const deleted = await this.prisma.form.update({
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
