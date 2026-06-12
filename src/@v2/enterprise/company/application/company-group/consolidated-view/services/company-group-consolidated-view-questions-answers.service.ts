import { Injectable } from '@nestjs/common';

import { BrowseFormQuestionsAnswersUseCase } from '@/@v2/forms/application/form-questions-answers/browse-form-questions-answers/use-cases/browse-form-questions-answers.usecase';
import { FormQuestionTypeEnum } from '@/@v2/forms/domain/enums/form-question-type.enum';
import { FormAnswerBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-answer-browse.model';
import { FormParticipantStructureBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-participant-structure-browse.model';
import { FormQuestionGroupWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-group-with-answers-browse.model';
import { FormQuestionWithAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-question-with-answers-browse.model';
import { ConsolidatedViewEligibleApplication } from './company-group-consolidated-view-eligibility.service';
import {
  FormApplicationStructureFingerprintService,
  FormQuestionCanonicalMapping,
} from './form-application-structure-fingerprint.service';
import { buildCanonicalOptionKey } from '../utils/form-question-canonical-key.util';

export type ConsolidatedViewQuestionsAnswersQuestionMeta = {
  canonicalQuestionKey: string;
  canonicalGroupKey: string;
  groupKind: 'identifier' | 'content';
  isMeasurable: boolean;
  isDemographic: boolean;
};

export type ConsolidatedViewQuestionsAnswersResult = {
  structureFingerprint: string;
  results: FormQuestionGroupWithAnswersBrowseModel[];
  participantStructures: FormParticipantStructureBrowseModel[];
  questionMetaById: Record<string, ConsolidatedViewQuestionsAnswersQuestionMeta>;
  totals: {
    totalParticipants: number;
    totalResponded: number;
    totalNotResponded: number;
    completionPercent: number;
  };
};

type MergedQuestionState = {
  canonicalQuestionKey: string;
  meta: ConsolidatedViewQuestionsAnswersQuestionMeta;
  question: FormQuestionWithAnswersBrowseModel;
  optionIdByCanonicalKey: Map<string, string>;
};

type MergedGroupState = {
  canonicalGroupKey: string;
  group: FormQuestionGroupWithAnswersBrowseModel;
  questions: Map<string, MergedQuestionState>;
};

@Injectable()
export class CompanyGroupConsolidatedViewQuestionsAnswersService {
  constructor(
    private readonly browseFormQuestionsAnswersUseCase: BrowseFormQuestionsAnswersUseCase,
    private readonly fingerprintService: FormApplicationStructureFingerprintService,
  ) {}

  async list(params: {
    applications: ConsolidatedViewEligibleApplication[];
    structureFingerprint: string;
  }): Promise<ConsolidatedViewQuestionsAnswersResult> {
    const mergedGroups = new Map<string, MergedGroupState>();
    const mergedStructures: FormParticipantStructureBrowseModel[] = [];
    const questionMetaById: Record<
      string,
      ConsolidatedViewQuestionsAnswersQuestionMeta
    > = {};

    let answerSequence = 0;

    for (const application of params.applications) {
      const [browse, mappings] = await Promise.all([
        this.browseFormQuestionsAnswersUseCase.execute({
          companyId: application.companyId,
          formApplicationId: application.applicationId,
        }),
        this.fingerprintService.buildQuestionCanonicalMappings(
          application.applicationId,
        ),
      ]);

      const mappingByQuestionId = new Map(
        mappings.map((mapping) => [mapping.questionId, mapping]),
      );

      for (const group of browse.results) {
        for (const question of group.questions) {
          const mapping = mappingByQuestionId.get(question.id);
          if (!mapping) continue;

          this.mergeQuestion({
            mergedGroups,
            questionMetaById,
            group,
            question,
            mapping,
            application,
            getNextAnswerId: () => {
              answerSequence += 1;
              return `consolidated-answer-${answerSequence}`;
            },
          });
        }
      }

      for (const structure of browse.participantStructures) {
        mergedStructures.push(
          new FormParticipantStructureBrowseModel({
            participantsAnswersId: `${application.applicationId}:${structure.participantsAnswersId}`,
            companyId: application.companyId,
            companyName: application.companyLabel,
            workspaceId: structure.workspaceId,
            workspaceName: structure.workspaceName,
            hierarchies: structure.hierarchies,
          }),
        );
      }
    }

    const results = [...mergedGroups.values()]
      .sort((left, right) => left.group.order - right.group.order)
      .map((mergedGroup) => {
        const questions = [...mergedGroup.questions.values()]
          .sort(
            (left, right) => left.question.order - right.question.order,
          )
          .map((item) => item.question);

        return new FormQuestionGroupWithAnswersBrowseModel({
          id: mergedGroup.group.id,
          name: mergedGroup.group.name,
          description: mergedGroup.group.description,
          order: mergedGroup.group.order,
          identifier: mergedGroup.group.identifier,
          questions,
        });
      });

    const uniqueParticipants = new Set(
      mergedStructures.map((structure) => structure.participantsAnswersId),
    );
    const totalParticipants = params.applications.reduce(
      (sum, application) => sum + application.totalParticipants,
      0,
    );
    const totalResponded = uniqueParticipants.size;
    const totalNotResponded = Math.max(totalParticipants - totalResponded, 0);
    const completionPercent =
      totalParticipants > 0
        ? Number(((totalResponded / totalParticipants) * 100).toFixed(2))
        : 0;

    return {
      structureFingerprint: params.structureFingerprint,
      results,
      participantStructures: mergedStructures,
      questionMetaById,
      totals: {
        totalParticipants,
        totalResponded,
        totalNotResponded,
        completionPercent,
      },
    };
  }

  private mergeQuestion(params: {
    mergedGroups: Map<string, MergedGroupState>;
    questionMetaById: Record<string, ConsolidatedViewQuestionsAnswersQuestionMeta>;
    group: FormQuestionGroupWithAnswersBrowseModel;
    question: FormQuestionWithAnswersBrowseModel;
    mapping: FormQuestionCanonicalMapping;
    application: ConsolidatedViewEligibleApplication;
    getNextAnswerId: () => string;
  }) {
    const {
      mergedGroups,
      questionMetaById,
      group,
      question,
      mapping,
      application,
      getNextAnswerId,
    } = params;

    let mergedGroup = mergedGroups.get(mapping.canonicalGroupKey);

    if (!mergedGroup) {
      mergedGroup = {
        canonicalGroupKey: mapping.canonicalGroupKey,
        group: new FormQuestionGroupWithAnswersBrowseModel({
          id: mapping.canonicalGroupKey,
          name: group.name,
          description: group.description,
          order: group.order,
          identifier: mapping.groupKind === 'identifier',
          questions: [],
        }),
        questions: new Map(),
      };
      mergedGroups.set(mapping.canonicalGroupKey, mergedGroup);
    }

    let mergedQuestion = mergedGroup.questions.get(mapping.canonicalQuestionKey);

    if (!mergedQuestion) {
      const optionIdByCanonicalKey = new Map<string, string>();
      const canonicalOptions = question.options.map((option) => {
        const canonicalOptionKey = buildCanonicalOptionKey({
          order: option.order,
          text: option.text,
          value: option.value ?? null,
        });
        const canonicalOptionId = `canonical-option:${canonicalOptionKey}`;
        optionIdByCanonicalKey.set(canonicalOptionKey, canonicalOptionId);

        return {
          id: canonicalOptionId,
          text: option.text,
          value: option.value,
          order: option.order,
        };
      });

      const mergedQuestionModel = new FormQuestionWithAnswersBrowseModel({
        id: mapping.canonicalQuestionKey,
        required: question.required,
        order: question.order,
        details: {
          id: mapping.canonicalQuestionKey,
          text: question.details.text,
          type: question.details.type,
        },
        options: canonicalOptions,
        answers: [],
      });

      mergedQuestion = {
        canonicalQuestionKey: mapping.canonicalQuestionKey,
        meta: {
          canonicalQuestionKey: mapping.canonicalQuestionKey,
          canonicalGroupKey: mapping.canonicalGroupKey,
          groupKind: mapping.groupKind,
          isMeasurable: mapping.isMeasurable,
          isDemographic: mapping.isDemographic,
        },
        question: mergedQuestionModel,
        optionIdByCanonicalKey,
      };

      mergedGroup.questions.set(mapping.canonicalQuestionKey, mergedQuestion);
      questionMetaById[mapping.canonicalQuestionKey] = mergedQuestion.meta;
    }

    const localOptionToCanonical = new Map<string, string>();

    for (const option of question.options) {
      const canonicalOptionKey = buildCanonicalOptionKey({
        order: option.order,
        text: option.text,
        value: option.value ?? null,
      });
      const canonicalOptionId =
        mergedQuestion.optionIdByCanonicalKey.get(canonicalOptionKey);

      if (canonicalOptionId) {
        localOptionToCanonical.set(option.id, canonicalOptionId);
      }
    }

    for (const answer of question.answers) {
      const mappedSelectedOptions = answer.selectedOptionsIds
        .map((optionId) => localOptionToCanonical.get(optionId))
        .filter((optionId): optionId is string => Boolean(optionId));

      if (
        mappedSelectedOptions.length === 0 &&
        question.details.type !== FormQuestionTypeEnum.SYSTEM
      ) {
        continue;
      }

      mergedQuestion.question.answers.push(
        new FormAnswerBrowseModel({
          id: getNextAnswerId(),
          value: answer.value,
          participantsAnswersId: `${application.applicationId}:${answer.participantsAnswersId}`,
          selectedOptionsIds: mappedSelectedOptions.length
            ? mappedSelectedOptions
            : answer.selectedOptionsIds,
        }),
      );
    }
  }
}
