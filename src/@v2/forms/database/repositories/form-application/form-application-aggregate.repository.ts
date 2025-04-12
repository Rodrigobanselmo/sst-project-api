import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormApplicationAggregateMapper } from '../../mappers/aggregates/form-application.mapper';
import { FormRepository } from '../form/form.repository';
import { IFormApplicationAggregateRepository } from './form-application-aggregate.types';

@Injectable()
export class FormApplicationAggregateRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions() {
    const include = {
      form: FormRepository.selectOptions(),
      question_identifier_group: {
        include: {
          questions: {
            include: {
              question_data: {
                include: {
                  question_identifier: true,
                },
              },
            },
          },
        },
      },
      participants: {
        include: {
          hierarchies: true,
          workspaces: true,
        },
      },
    } satisfies Prisma.FormApplicationFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormApplicationAggregateRepository.CreateParams): IFormApplicationAggregateRepository.CreateReturn {
    const formApplication = await this.prisma.$transaction(async (tx) => {
      const questionIdentifierGroup = params.identifier
        ? await tx.formQuestionIdentifierGroup.create({
            data: {
              name: params.identifier.group.name,
              description: params.identifier.group.description,
              questions: {
                createMany: {
                  data: params.identifier.questionIdentifiers.map(({ question, identifierData }) => ({
                    order: question.order,
                    required: question.required,
                    question_data_id: identifierData.data.id,
                  })),
                },
              },
            },
          })
        : null;

      const formApplication = await tx.formApplication.create({
        data: {
          form_id: params.form.id,
          name: params.formApplication.name,
          company_id: params.formApplication.companyId,
          description: params.formApplication.description,
          status: params.formApplication.status,
          ended_at: params.formApplication.endedAt,
          started_at: params.formApplication.startAt,
          shareable_link: params.formApplication.shareableLink,
          question_identifier_group_id: questionIdentifierGroup?.id,
          participants: {
            create: {
              hierarchies: {
                createMany: {
                  data: params.participantsHierarchies.map((patient) => ({
                    hierarchy_id: patient.hierarchyId,
                  })),
                },
              },
              workspaces: {
                createMany: {
                  data: params.participantsWorkspaces.map((workspace) => ({
                    workspace_id: workspace.workspaceId,
                  })),
                },
              },
            },
          },
        },
        ...FormApplicationAggregateRepository.selectOptions(),
      });

      return formApplication;
    });

    return formApplication ? FormApplicationAggregateMapper.toAggregate(formApplication) : null;
  }

  async update(params: IFormApplicationAggregateRepository.UpdateParams): IFormApplicationAggregateRepository.UpdateReturn {
    const formApplication = await this.prisma.formApplication.update({
      where: {
        id: params.formApplication.id,
        company_id: params.formApplication.companyId,
      },
      data: {},
      ...FormApplicationAggregateRepository.selectOptions(),
    });

    return formApplication ? FormApplicationAggregateMapper.toAggregate(formApplication) : null;
  }

  async find(params: IFormApplicationAggregateRepository.FindParams): IFormApplicationAggregateRepository.FindReturn {
    const formApplication = await this.prisma.formApplication.findFirst({
      where: {
        id: params.id,
        company_id: params.companyId,
      },
      ...FormApplicationAggregateRepository.selectOptions(),
    });

    return formApplication ? FormApplicationAggregateMapper.toAggregate(formApplication) : null;
  }
}
