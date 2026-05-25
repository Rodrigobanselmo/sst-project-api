import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import { formApplicationAccessWhere } from '@/@v2/forms/application/shared/helpers/form-application-access.helper';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormApplicationAggregateMapper } from '../../mappers/aggregates/form-application-aggregate.mapper';
import { FormQuestionIdentifierGroupAggregateRepository } from '../form-question-identifier-group/form-question-identifier-group-aggregate.repository';
import { FormRepository } from '../form/form.repository';
import { IFormApplicationAggregateRepository } from './form-application-aggregate.types';

@Injectable()
export class FormApplicationAggregateRepository {
  constructor(
    private readonly prisma: PrismaServiceV2,
    private readonly formQuestionIdentifierGroupAggregateRepository: FormQuestionIdentifierGroupAggregateRepository,
  ) {}

  static selectOptions() {
    const include = {
      form: FormRepository.selectOptions(),
      question_identifier_group: FormQuestionIdentifierGroupAggregateRepository.selectOptions(),
      participants: {
        include: {
          hierarchies: true,
          workspaces: true,
        },
      },
      applicationCompanies: true,
    } satisfies Prisma.FormApplicationFindFirstArgs['include'];

    return { include };
  }

  async create(params: IFormApplicationAggregateRepository.CreateParams): IFormApplicationAggregateRepository.CreateReturn {
    const formApplication = await this.prisma.$transaction(async (tx) => {
      const formApplication = await tx.formApplication.create({
        data: {
          id: params.formApplication.id,
          form_id: params.form.id,
          name: params.formApplication.name,
          company_id: params.formApplication.companyId,
          description: params.formApplication.description,
          status: params.formApplication.status,
          ended_at: params.formApplication.endedAt,
          started_at: params.formApplication.startAt,
          participation_goal: params.formApplication.participationGoal,
          anonymous: params.formApplication.anonymous,
          shareable_link: params.formApplication.shareableLink,
          banner_intro_text: params.formApplication.bannerIntroText,
          banner_why_text: params.formApplication.bannerWhyText,
          banner_contact_text: params.formApplication.bannerContactText,
          reminder_count: params.formApplication.reminderCount,
          scope_type: params.formApplication.scopeType,
          company_group_id: params.formApplication.companyGroupId,
          applicationCompanies: params.applicationCompanies.length
            ? {
                createMany: {
                  data: params.applicationCompanies.map((company) => ({
                    id: company.id,
                    company_id: company.companyId,
                  })),
                },
              }
            : undefined,
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
        select: {
          id: true,
        },
      });

      await this.formQuestionIdentifierGroupAggregateRepository.createTx(params.identifier, tx);

      return formApplication;
    });

    return !!formApplication?.id;
  }

  async update(params: IFormApplicationAggregateRepository.UpdateParams): IFormApplicationAggregateRepository.UpdateReturn {
    const formApplication = await this.prisma.$transaction(async (tx) => {
      const listCreateHierarchyParticipants = params.participantsHierarchies.filter((participant) => participant.isNew);
      const listCreateWorkspaceParticipants = params.participantsWorkspaces.filter((participant) => participant.isNew);
      const listCreateApplicationCompanies = params.applicationCompanies.filter((company) => company.isNew);

      const formApplication = await tx.formApplication.update({
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
          participation_goal: params.formApplication.participationGoal,
          form_id: params.form.id,
          anonymous: params.formApplication.anonymous,
          shareable_link: params.formApplication.shareableLink,
          banner_intro_text: params.formApplication.bannerIntroText,
          banner_why_text: params.formApplication.bannerWhyText,
          banner_contact_text: params.formApplication.bannerContactText,
          reminder_count: params.formApplication.reminderCount,
          scope_type: params.formApplication.scopeType,
          company_group_id: params.formApplication.companyGroupId,
          applicationCompanies:
            params.formApplication.scopeType ===
              FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
              ? {
                  deleteMany: {
                    company_id: {
                      notIn: params.applicationCompanies.map((company) => company.companyId),
                    },
                  },
                  createMany: listCreateApplicationCompanies.length
                    ? {
                        data: listCreateApplicationCompanies.map((company) => ({
                          id: company.id,
                          company_id: company.companyId,
                        })),
                      }
                    : undefined,
                }
              : undefined,
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
        select: {
          id: true,
        },
      });

      await this.formQuestionIdentifierGroupAggregateRepository.upsertTx(params.identifier, tx);

      return formApplication;
    });

    return !!formApplication?.id;
  }

  async find(params: IFormApplicationAggregateRepository.FindParams): IFormApplicationAggregateRepository.FindReturn {
    const formApplication = await this.prisma.formApplication.findFirst({
      where:
        params.companyId != null
          ? formApplicationAccessWhere({
              formApplicationId: params.id,
              accessCompanyId: params.companyId,
            })
          : {
              id: params.id,
              deleted_at: null,
            },
      ...FormApplicationAggregateRepository.selectOptions(),
    });

    return formApplication ? FormApplicationAggregateMapper.toAggregate(formApplication) : null;
  }
}
