import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormAggregateMapper } from '../../mappers/aggregates/form-aggregate.mapper';
import { IFormAggregateRepository } from './form-aggregate.types';
import { FormQuestionGroupAggregateRepository } from '../form-question-group/form-question-group-aggregate.repository';

@Injectable()
export class FormAggregateRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formQuestionGroupAggregateRepository: FormQuestionGroupAggregateRepository,
  ) {}

  static selectOptions() {
    const include = {
      questions_groups: {
        where: { deleted_at: null },
        ...FormQuestionGroupAggregateRepository.selectOptions(),
      },
    } satisfies Prisma.FormFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormAggregateRepository.CreateParams): IFormAggregateRepository.CreateReturn {
    const formAggregate = await this.prisma.$transaction(async (tx) => {
      const form = await tx.form.create({
        data: {
          id: params.form.id,
          name: params.form.name,
          company_id: params.form.companyId,
          type: params.form.type,
          description: params.form.description,
          anonymous: params.form.anonymous,
          shareable_link: params.form.shareableLink,
          system: params.form.system,
        },
      });

      for (const questionGroup of params.questionGroups) {
        await this.formQuestionGroupAggregateRepository.createTx(questionGroup, tx);
      }

      const completeForm = await tx.form.findFirst({
        where: { id: form.id },
        ...FormAggregateRepository.selectOptions(),
      });

      return completeForm;
    });

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }

  async find(params: IFormAggregateRepository.FindParams): IFormAggregateRepository.FindReturn {
    const formAggregate = await this.prisma.form.findFirst({
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
      ...FormAggregateRepository.selectOptions(),
    });

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }

  async update(aggregate: IFormAggregateRepository.UpdateParams): IFormAggregateRepository.UpdateReturn {
    const formAggregate = await this.prisma.$transaction(
      async (tx) => {
        await tx.form.update({
          where: {
            id: aggregate.form.id,
            company_id: aggregate.form.companyId,
          },
          data: {
            name: aggregate.form.name,
            type: aggregate.form.type,
            description: aggregate.form.description,
            anonymous: aggregate.form.anonymous,
            shareable_link: aggregate.form.shareableLink,
          },
        });

        for (const questionGroup of aggregate.questionGroups) {
          await this.formQuestionGroupAggregateRepository.upsertTx(questionGroup, tx);
        }

        const completeForm = await tx.form.findFirst({
          where: { id: aggregate.form.id },
          ...FormAggregateRepository.selectOptions(),
        });

        return completeForm;
      },
      {
        timeout: 30000, // 30 seconds timeout
      },
    );

    return formAggregate ? FormAggregateMapper.toAggregate(formAggregate) : null;
  }
}
