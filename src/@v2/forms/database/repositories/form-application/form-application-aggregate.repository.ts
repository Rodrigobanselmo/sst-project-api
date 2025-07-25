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
              data: true,
              question_details: {
                include: {
                  question_identifier: true,
                  data: true,
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
                    question_details_id: identifierData.data.id,
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
          question_identifier_group_id: questionIdentifierGroup?.id,
          participants: {
            create: {
              hierarchies: params.participantsHierarchies.length
                ? {
                    createMany: {
                      data: params.participantsHierarchies.map((patient) => ({
                        hierarchy_id: patient.hierarchyId,
                      })),
                    },
                  }
                : undefined,
              workspaces: params.participantsWorkspaces.length
                ? {
                    createMany: {
                      data: params.participantsWorkspaces.map((workspace) => ({
                        workspace_id: workspace.workspaceId,
                      })),
                    },
                  }
                : undefined,
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
    const listCreateHierarchyParticipants = params.participantsHierarchies.filter((participant) => !participant.id);
    const listCreateWorkspaceParticipants = params.participantsWorkspaces.filter((participant) => !participant.id);

    const formApplication = await this.prisma.formApplication.update({
      where: {
        id: params.formApplication.id,
        company_id: params.formApplication.companyId,
      },
      data: {
        name: params.formApplication.name,
        description: params.formApplication.description,
        ended_at: params.formApplication.endedAt,
        started_at: params.formApplication.startAt,
        status: params.formApplication.status,
        form_id: params.form.id,
        participants: {
          update: {
            hierarchies: {
              deleteMany: {
                hierarchy_id: {
                  notIn: params.participantsHierarchies.map((patient) => patient.hierarchyId),
                },
              },
              createMany: listCreateHierarchyParticipants.length
                ? {
                    data: listCreateHierarchyParticipants.map((patient) => ({
                      hierarchy_id: patient.hierarchyId,
                    })),
                  }
                : undefined,
            },
            workspaces: {
              deleteMany: {
                workspace_id: {
                  notIn: params.participantsWorkspaces.map((workspace) => workspace.workspaceId),
                },
              },
              createMany: listCreateWorkspaceParticipants.length
                ? {
                    data: listCreateWorkspaceParticipants.map((workspace) => ({
                      workspace_id: workspace.workspaceId,
                    })),
                  }
                : undefined,
            },
          },
        },
      },
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
