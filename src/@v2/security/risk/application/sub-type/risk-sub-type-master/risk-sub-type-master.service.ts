import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';
import { buildRiskSubTypeSlug } from '@/shared/utils/risk-sub-type-slug.util';

import {
  CreateMasterRiskSubTypeBody,
  UpdateMasterRiskSubTypeBody,
} from './risk-sub-type-master.dto';
import { RiskSubTypeMasterRepository } from './risk-sub-type-master.repository';

@Injectable()
export class RiskSubTypeMasterService {
  constructor(private readonly repository: RiskSubTypeMasterRepository) {}

  browse(params: {
    page: number;
    limit: number;
    filters?: {
      type?: RiskTypeEnum;
      search?: string;
      status?: StatusEnum;
    };
  }) {
    return this.repository.browse(params);
  }

  async create(body: CreateMasterRiskSubTypeBody, createdById: number) {
    const name = body.name.trim();
    if (!name) {
      throw new BadRequestException('Nome do subtipo é obrigatório.');
    }

    const slug = buildRiskSubTypeSlug(name);
    if (!slug) {
      throw new BadRequestException('Nome do subtipo inválido.');
    }

    const duplicate = await this.repository.findByTypeAndSlug(body.type, slug);
    if (duplicate) {
      throw new BadRequestException(
        'Já existe um subtipo com esse nome para o tipo de risco selecionado.',
      );
    }

    return this.repository.create({
      name,
      slug,
      type: body.type,
      description: body.description?.trim() || null,
      status: StatusEnum.ACTIVE,
      system: false,
      sub_type: null,
      createdById,
    });
  }

  async update(id: number, body: UpdateMasterRiskSubTypeBody) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Subtipo de risco não encontrado.');
    }

    const data: {
      name?: string;
      slug?: string;
      description?: string | null;
      status?: StatusEnum;
    } = {};

    if (body.description !== undefined) {
      data.description = body.description?.trim() || null;
    }

    if (body.status !== undefined) {
      data.status = body.status;
    }

    if (body.name !== undefined) {
      if (existing.system) {
        throw new BadRequestException(
          'Subtipos do sistema não podem ter o nome alterado.',
        );
      }

      const name = body.name.trim();
      if (!name) {
        throw new BadRequestException('Nome do subtipo é obrigatório.');
      }

      const slug = buildRiskSubTypeSlug(name);
      if (!slug) {
        throw new BadRequestException('Nome do subtipo inválido.');
      }

      if (slug !== existing.slug) {
        const duplicate = await this.repository.findByTypeAndSlug(
          existing.type,
          slug,
        );
        if (duplicate && duplicate.id !== id) {
          throw new BadRequestException(
            'Já existe um subtipo com esse nome para o tipo de risco selecionado.',
          );
        }
      }

      data.name = name;
      data.slug = slug;
    }

    if (!Object.keys(data).length) {
      return existing;
    }

    return this.repository.update(id, data);
  }

  async updateStatus(id: number, status: StatusEnum) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException('Subtipo de risco não encontrado.');
    }

    return this.repository.update(id, { status });
  }
}
