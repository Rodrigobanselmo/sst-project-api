import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormQuestionIdentifierDataAggregateMapper } from '../../mappers/aggregates/form-question-identifier-data.mapper';
import { IFormQuestionIdentifierDataAggregateRepository } from './form-question-identifier-data-aggregate.types';

@Injectable()
export class FormQuestionDataAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      question_identifier: true,
    } satisfies Prisma.FormQuestionDataFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormQuestionIdentifierDataAggregateRepository.CreateParams): IFormQuestionIdentifierDataAggregateRepository.CreateReturn {
    const FormQuestionData = await this.prisma.formQuestionData.create({
      data: {
        text: params.data.text,
        system: params.data.system,
        type: params.data.type,
        accept_other: params.data.acceptOther,
        company_id: params.data.companyId,
      },
      ...FormQuestionDataAggregateRepository.selectOptions(),
    });

    return FormQuestionData ? FormQuestionIdentifierDataAggregateMapper.toAggregate(FormQuestionData) : null;
  }

  async update(params: IFormQuestionIdentifierDataAggregateRepository.UpdateParams): IFormQuestionIdentifierDataAggregateRepository.UpdateReturn {
    const FormQuestionData = await this.prisma.formQuestionData.update({
      where: {
        id: params.data.id,
      },
      data: {
        text: params.data.text,
        system: params.data.system,
        type: params.data.type,
        accept_other: params.data.acceptOther,
        company_id: params.data.companyId,
      },
      ...FormQuestionDataAggregateRepository.selectOptions(),
    });

    return FormQuestionData ? FormQuestionIdentifierDataAggregateMapper.toAggregate(FormQuestionData) : null;
  }

  async find(params: IFormQuestionIdentifierDataAggregateRepository.FindParams): IFormQuestionIdentifierDataAggregateRepository.FindReturn {
    const FormQuestionData = await this.prisma.formQuestionData.findFirst({
      where: {
        id: params.id,
        question_identifier_id: { not: null },
        OR: [
          {
            company_id: params.companyId,
          },
          {
            system: true,
          },
        ],
      },
      ...FormQuestionDataAggregateRepository.selectOptions(),
    });

    return FormQuestionData ? FormQuestionIdentifierDataAggregateMapper.toAggregate(FormQuestionData) : null;
  }

  async findMany(params: IFormQuestionIdentifierDataAggregateRepository.FindManyParams): IFormQuestionIdentifierDataAggregateRepository.FindManyReturn {
    const FormQuestionData = await this.prisma.formQuestionData.findMany({
      where: {
        id: { in: params.ids },
        OR: [
          {
            company_id: params.companyId,
          },
          {
            system: true,
          },
        ],
      },
      ...FormQuestionDataAggregateRepository.selectOptions(),
    });

    return FormQuestionIdentifierDataAggregateMapper.toArray(FormQuestionData);
  }
}
