import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormQuestionIdentifierDataAggregateMapper } from '../../mappers/aggregates/form-question-identifier-data.mapper';
import { IFormQuestionIdentifierDataAggregateRepository } from './form-question-identifier-data-aggregate.types';

// RELOAD
@Injectable()
export class FormQuestionDataAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      question_identifier: true,
      data: true,
    } satisfies Prisma.FormQuestionDetailsFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormQuestionIdentifierDataAggregateRepository.CreateParams): IFormQuestionIdentifierDataAggregateRepository.CreateReturn {
    const FormQuestionData = await this.prisma.formQuestionDetails.create({
      data: {
        system: params.data.system,
        company_id: params.data.companyId,
        question_identifier_id: params.identifier.id,
        data: {
          create: {
            text: params.data.text,
            type: params.data.type,
            accept_other: params.data.acceptOther,
          },
        },
      },
      ...FormQuestionDataAggregateRepository.selectOptions(),
    });

    return FormQuestionData ? FormQuestionIdentifierDataAggregateMapper.toAggregate(FormQuestionData) : null;
  }

  async update(params: IFormQuestionIdentifierDataAggregateRepository.UpdateParams): IFormQuestionIdentifierDataAggregateRepository.UpdateReturn {
    await this.prisma.$transaction(async (tx) => {
      await tx.formQuestionDetailsData.updateMany({
        where: { form_question_details_id: params.data.id, deleted_at: null },
        data: { deleted_at: new Date() },
      });

      await tx.formQuestionDetailsData.create({
        data: {
          text: params.data.text,
          type: params.data.type,
          accept_other: params.data.acceptOther,
          form_question_details_id: params.data.id,
        },
      });
    });

    return this.find({ id: params.data.id, companyId: params.data.companyId });
  }

  async find(params: IFormQuestionIdentifierDataAggregateRepository.FindParams): IFormQuestionIdentifierDataAggregateRepository.FindReturn {
    const FormQuestionData = await this.prisma.formQuestionDetails.findFirst({
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
    const FormQuestionData = await this.prisma.formQuestionDetails.findMany({
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
