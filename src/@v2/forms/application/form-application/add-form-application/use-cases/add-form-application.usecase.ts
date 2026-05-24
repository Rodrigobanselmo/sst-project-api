import { FormApplicationAggregateRepository } from '@/@v2/forms/database/repositories/form-application/form-application-aggregate.repository';
import { FormQuestionIdentifierEntityRepository } from '@/@v2/forms/database/repositories/form-question-identifier/form-question-identifier.repository';
import { FormRepository } from '@/@v2/forms/database/repositories/form/form.repository';
import { FormApplicationAggregate } from '@/@v2/forms/domain/aggregates/form-application.aggregate';
import { FormParticipantsAggregate } from '@/@v2/forms/domain/aggregates/form-participants.aggregate';
import { FormQuestionIdentifierGroupAggregate } from '@/@v2/forms/domain/aggregates/form-question-identifier-group.aggregate';
import { FormQuestionAggregate } from '@/@v2/forms/domain/aggregates/form-question.aggregate';
import { FormApplicationEntity } from '@/@v2/forms/domain/entities/form-application.entity';
import { FormParticipantsEntity } from '@/@v2/forms/domain/entities/form-participants.entity';
import { FormParticipantsHierarchyEntity } from '@/@v2/forms/domain/entities/form-participants-hierarchy.entity';
import { FormParticipantsWorkspaceEntity } from '@/@v2/forms/domain/entities/form-participants-workspace.entity';
import { FormQuestionGroupEntity } from '@/@v2/forms/domain/entities/form-question-group.entity';
import { FormQuestionEntity } from '@/@v2/forms/domain/entities/form-question.entity';
import { FormQuestionDetailsFactory } from '@/@v2/forms/domain/factories/form-question-details.factory';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IAddFormApplicationUseCase } from './add-form-application.types';
import { FormQuestionOptionEntity } from '@/@v2/forms/domain/entities/form-question-option.entity';
import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import { FormApplicationCompanyEntity } from '@/@v2/forms/domain/entities/form-application-company.entity';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { validateFormApplicationCompanies } from '../../shared/validate-form-application-companies.helper';

@Injectable()
export class AddFormApplicationUseCase {
  constructor(
    private readonly formApplicationAggregateRepository: FormApplicationAggregateRepository,
    private readonly formQuestionIdentifierEntityRepository: FormQuestionIdentifierEntityRepository,
    private readonly formRepository: FormRepository,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: IAddFormApplicationUseCase.Params) {
    const form = await this.formRepository.find({ id: params.formId, companyId: params.companyId });
    if (!form) throw new BadRequestException('Formulário não encontrado');

    const scopeType =
      params.scopeType ?? FormApplicationScopeTypeEnum.COMPANY_WORKSPACES;

    await validateFormApplicationCompanies({
      prisma: this.prisma,
      scopeType,
      companyGroupId: params.companyGroupId,
      companyIds: params.companyIds,
      workspaceIds: params.workspaceIds,
      hierarchyIds: params.hierarchyIds,
    });

    const formApplication = new FormApplicationEntity({
      name: params.name,
      description: params.description,
      companyId: params.companyId,
      anonymous: params.anonymous,
      shareableLink: params.shareableLink,
      participationGoal: params.participationGoal,
      scopeType,
      companyGroupId:
        scopeType === FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
          ? params.companyGroupId ?? null
          : null,
    });

    const participantsHierarchies = params.hierarchyIds.map((hierarchyId) => {
      return new FormParticipantsHierarchyEntity({
        hierarchyId,
      });
    });

    const participantsWorkspaces = params.workspaceIds.map((workspaceId) => {
      return new FormParticipantsWorkspaceEntity({
        workspaceId,
      });
    });

    const questionGroup = new FormQuestionGroupEntity({
      order: 0,
      name: params.identifier.name,
      description: params.identifier.description,
    });

    const questionIdentifiers = await asyncBatch({
      items: params.identifier.questions,
      batchSize: 10,
      callback: async (question, index) => {
        const questionEntity = new FormQuestionEntity({
          order: index,
          required: question.required,
          groupId: questionGroup.id,
        });

        const identifierEntity = await this.formQuestionIdentifierEntityRepository.find({ type: question.details.identifierType });
        if (!identifierEntity) throw new BadRequestException('Tipo  de pergunta não encontrada');

        const detailsEntity = FormQuestionDetailsFactory.createFromIdentifierType({
          text: question.details.text,
          identifierType: question.details.identifierType,
          companyId: params.companyId,
          acceptOther: question.details.acceptOther,
        });

        const optionsEntities: FormQuestionOptionEntity[] = [];
        if (detailsEntity.needsOptions) {
          question.options?.forEach((option, optionIndex) => {
            const optionEntity = new FormQuestionOptionEntity({
              text: option.text,
              order: optionIndex,
              value: option.value,
            });

            optionsEntities.push(optionEntity);
          });
        }

        return new FormQuestionAggregate({
          question: questionEntity,
          identifier: identifierEntity,
          details: detailsEntity,
          options: optionsEntities,
        });
      },
    });

    const questionIdentifierGroup = new FormQuestionIdentifierGroupAggregate({
      questionGroup: questionGroup,
      questions: questionIdentifiers,
      formApplication,
    });

    const formParticipants = new FormParticipantsEntity({});

    const participantsAggregate = new FormParticipantsAggregate({
      formParticipants,
      participantsHierarchies,
      participantsWorkspaces,
    });

    const applicationCompanies =
      scopeType === FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
        ? (params.companyIds ?? []).map(
            (companyId) => new FormApplicationCompanyEntity({ companyId }),
          )
        : [];

    const formApplicationAggregate = new FormApplicationAggregate({
      form,
      formApplication,
      participants: participantsAggregate,
      identifier: questionIdentifierGroup,
      applicationCompanies,
    });

    await this.formApplicationAggregateRepository.create(formApplicationAggregate);
  }
}
