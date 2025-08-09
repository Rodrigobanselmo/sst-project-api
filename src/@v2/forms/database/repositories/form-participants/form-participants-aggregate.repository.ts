import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormParticipantsAggregateMapper } from '../../mappers/aggregates/form-participants-aggregate.mapper';
import { IFormParticipantsAggregateRepository } from './form-participants-aggregate.repository.types';

@Injectable()
export class FormParticipantsAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      workspaces: true,
      hierarchies: true,
    } satisfies Prisma.FormParticipantsFindFirstArgs['include'];

    return { include };
  }

  async find(params: IFormParticipantsAggregateRepository.FindParams): IFormParticipantsAggregateRepository.FindReturn {
    const formParticipants = await this.prisma.formParticipants.findFirst({
      where: {
        id: params.id,
        form_application: {
          company_id: params.companyId,
        },
      },
      ...FormParticipantsAggregateRepository.selectOptions(),
    });

    return formParticipants ? FormParticipantsAggregateMapper.toAggregate(formParticipants) : null;
  }

  async findByFormApplicationId(params: IFormParticipantsAggregateRepository.FindByFormApplicationIdParams): IFormParticipantsAggregateRepository.FindByFormApplicationIdReturn {
    const formParticipants = await this.prisma.formParticipants.findFirst({
      where: {
        form_application_id: params.formApplicationId,
        form_application: params.companyId
          ? {
              company_id: params.companyId,
            }
          : undefined,
      },
      ...FormParticipantsAggregateRepository.selectOptions(),
    });

    return formParticipants ? FormParticipantsAggregateMapper.toAggregate(formParticipants) : null;
  }
}
