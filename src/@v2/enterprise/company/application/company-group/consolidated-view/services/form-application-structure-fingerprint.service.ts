import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import { PrismaService } from '@/prisma/prisma.service';

import {
  buildCanonicalGroupKey,
  buildCanonicalQuestionKey,
  CanonicalQuestionShape,
  isMeasurableCanonicalQuestion,
} from '../utils/form-question-canonical-key.util';

type CanonicalOption = {
  order: number;
  text: string;
  value: number | null;
};

type CanonicalQuestion = CanonicalQuestionShape & {
  order?: number;
  options: CanonicalOption[];
};

export type FormQuestionCanonicalMapping = {
  questionId: string;
  canonicalQuestionKey: string;
  canonicalGroupKey: string;
  groupKind: 'identifier' | 'content';
  isMeasurable: boolean;
  isDemographic: boolean;
};

type CanonicalGroup = {
  kind: 'identifier' | 'content';
  name: string;
  order: number;
  questions: CanonicalQuestion[];
};

@Injectable()
export class FormApplicationStructureFingerprintService {
  constructor(private readonly prisma: PrismaService) {}

  async computeFingerprint(applicationId: string): Promise<string> {
    const structure = await this.buildCanonicalStructure(applicationId);
    return createHash('sha256').update(JSON.stringify(structure)).digest('hex');
  }

  async buildQuestionCanonicalMappings(
    applicationId: string,
  ): Promise<FormQuestionCanonicalMapping[]> {
    const application = await this.prisma.formApplication.findFirst({
      where: { id: applicationId, deleted_at: null },
      select: { id: true, form_id: true },
    });

    if (!application) {
      return [];
    }

    const groups = await this.prisma.formQuestionGroup.findMany({
      where: {
        deleted_at: null,
        OR: [
          { form_application_id: applicationId },
          { form_id: application.form_id, form_application_id: null },
        ],
      },
      include: {
        data: {
          where: { deleted_at: null },
          orderBy: { updated_at: 'desc' },
          take: 1,
        },
        questions: {
          where: { deleted_at: null },
          include: {
            data: {
              where: { deleted_at: null },
              orderBy: { updated_at: 'desc' },
              take: 1,
            },
            question_details: {
              include: {
                data: {
                  where: { deleted_at: null },
                  orderBy: { updated_at: 'desc' },
                  take: 1,
                  include: {
                    question_identifier: { select: { type: true } },
                    question_copsoq: { select: { id: true } },
                  },
                },
                options: {
                  where: { deleted_at: null },
                  include: {
                    data: {
                      where: { deleted_at: null },
                      orderBy: { updated_at: 'desc' },
                      take: 1,
                    },
                  },
                },
                form_question_risk: {
                  include: {
                    risk: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const mappings: FormQuestionCanonicalMapping[] = [];

    for (const group of groups) {
      const canonicalGroup = this.mapGroup(group, applicationId);
      const canonicalGroupKey = buildCanonicalGroupKey({
        kind: canonicalGroup.kind,
        name: canonicalGroup.name,
        order: canonicalGroup.order,
      });

      for (const question of group.questions) {
        const canonicalQuestion = this.mapQuestion(question, {
          isIdentifierGroup: canonicalGroup.kind === 'identifier',
        });

        if (!canonicalQuestion) continue;

        const canonicalQuestionKey = buildCanonicalQuestionKey(canonicalQuestion);

        mappings.push({
          questionId: question.id,
          canonicalQuestionKey,
          canonicalGroupKey,
          groupKind: canonicalGroup.kind,
          isMeasurable: isMeasurableCanonicalQuestion(canonicalQuestion),
          isDemographic: canonicalGroup.kind === 'identifier',
        });

      }
    }

    return mappings;
  }

  async computeFingerprints(
    applicationIds: string[],
  ): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(applicationIds)];
    const entries = await Promise.all(
      uniqueIds.map(async (applicationId) => {
        const fingerprint = await this.computeFingerprint(applicationId);
        return [applicationId, fingerprint] as const;
      }),
    );

    return new Map(entries);
  }

  private async buildCanonicalStructure(
    applicationId: string,
  ): Promise<CanonicalGroup[]> {
    const application = await this.prisma.formApplication.findFirst({
      where: { id: applicationId, deleted_at: null },
      select: { id: true, form_id: true },
    });

    if (!application) {
      return [];
    }

    const groups = await this.prisma.formQuestionGroup.findMany({
      where: {
        deleted_at: null,
        OR: [
          { form_application_id: applicationId },
          { form_id: application.form_id, form_application_id: null },
        ],
      },
      include: {
        data: {
          where: { deleted_at: null },
          orderBy: { updated_at: 'desc' },
          take: 1,
        },
        questions: {
          where: { deleted_at: null },
          include: {
            data: {
              where: { deleted_at: null },
              orderBy: { updated_at: 'desc' },
              take: 1,
            },
            question_details: {
              include: {
                data: {
                  where: { deleted_at: null },
                  orderBy: { updated_at: 'desc' },
                  take: 1,
                  include: {
                    question_identifier: { select: { type: true } },
                    question_copsoq: { select: { id: true } },
                  },
                },
                options: {
                  where: { deleted_at: null },
                  include: {
                    data: {
                      where: { deleted_at: null },
                      orderBy: { updated_at: 'desc' },
                      take: 1,
                    },
                  },
                },
                form_question_risk: {
                  include: {
                    risk: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const canonicalGroups = groups
      .map((group) => this.mapGroup(group, applicationId))
      .sort((left, right) => {
        if (left.kind !== right.kind) {
          return left.kind === 'identifier' ? -1 : 1;
        }

        if (left.order !== right.order) {
          return left.order - right.order;
        }

        return left.name.localeCompare(right.name);
      });

    return canonicalGroups;
  }

  private normalizeText(text: string): string {
    return text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private mapGroup(
    group: {
      form_application_id: string | null;
      data: { name: string; order: number }[];
      questions: {
        data: { required: boolean; order: number }[];
        question_details: {
          system: boolean;
          data: {
            text: string;
            type: string;
            accept_other: boolean;
            question_identifier: { type: string } | null;
            question_copsoq: { id: string } | null;
          }[];
          options: {
            data: { text: string; order: number; value: number | null }[];
          }[];
          form_question_risk: { risk: { name: string } }[];
        };
      }[];
    },
    applicationId: string,
  ): CanonicalGroup {
    const groupData = group.data[0];
    const isIdentifierGroup = group.form_application_id === applicationId;

    const questions = group.questions
      .map((question) =>
        this.mapQuestion(question, { isIdentifierGroup }),
      )
      .filter((question): question is CanonicalQuestion => question !== null);

    const sortedQuestions = isIdentifierGroup
      ? [...questions].sort((left, right) => {
          const identifierTypeCompare = (left.identifierType || '').localeCompare(
            right.identifierType || '',
          );

          if (identifierTypeCompare !== 0) {
            return identifierTypeCompare;
          }

          return left.text.localeCompare(right.text);
        })
      : [...questions].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

    return {
      kind: isIdentifierGroup ? 'identifier' : 'content',
      name: isIdentifierGroup ? '' : (groupData?.name || '').trim(),
      order: groupData?.order ?? 0,
      questions: sortedQuestions,
    };
  }

  private mapQuestion(
    question: {
      data: { required: boolean; order: number }[];
      question_details: {
        system: boolean;
        data: {
          text: string;
          type: string;
          accept_other: boolean;
          question_identifier: { type: string } | null;
          question_copsoq: { id: string } | null;
        }[];
        options: {
          data: { text: string; order: number; value: number | null }[];
        }[];
        form_question_risk: { risk: { name: string } }[];
      };
    },
    params: { isIdentifierGroup: boolean },
  ): CanonicalQuestion | null {
    const questionData = question.data[0];
    const detailsData = question.question_details.data[0];

    if (!questionData || !detailsData) {
      return null;
    }

    const options = question.question_details.options
      .map((option) => {
        const optionData = option.data[0];
        if (!optionData) return null;

        return {
          order: optionData.order,
          text: this.normalizeText(optionData.text),
          value: optionData.value ?? null,
        };
      })
      .filter((option): option is CanonicalOption => option !== null)
      .sort((left, right) => left.order - right.order);

    const riskNames = question.question_details.form_question_risk
      .map((riskLink) => riskLink.risk.name.trim().toLowerCase())
      .sort();

    const baseQuestion = {
      required: questionData.required,
      text: this.normalizeText(detailsData.text),
      type: detailsData.type,
      acceptOther: detailsData.accept_other,
      system: question.question_details.system,
      identifierType: detailsData.question_identifier?.type ?? null,
      copsoqId: detailsData.question_copsoq?.id ?? null,
      options,
      riskNames,
    };

    if (params.isIdentifierGroup) {
      return baseQuestion;
    }

    return {
      ...baseQuestion,
      order: questionData.order,
    };
  }
}
