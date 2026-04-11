import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FormIdentifierTypeEnum,
  FormPreliminaryLibraryCategoryEnum,
  FormPreliminaryLibraryQuestionTypeEnum,
  Prisma,
} from '@prisma/client';
import { getFormCatalogAccessibleOrWhereParts } from '../../utils/form-catalog-accessible-where';

const questionListInclude = {
  options: {
    where: { deleted_at: null },
    orderBy: { order: 'asc' as const },
  },
} satisfies Prisma.FormPreliminaryLibraryQuestionInclude;

const blockDetailInclude = {
  items: {
    orderBy: { order: 'asc' as const },
    include: {
      library_question: {
        include: {
          options: {
            where: { deleted_at: null },
            orderBy: { order: 'asc' as const },
          },
        },
      },
    },
  },
} satisfies Prisma.FormPreliminaryLibraryBlockInclude;

export type FormPreliminaryLibraryQuestionWithOptions = Prisma.FormPreliminaryLibraryQuestionGetPayload<{
  include: typeof questionListInclude;
}>;

export type FormPreliminaryLibraryBlockDetail = Prisma.FormPreliminaryLibraryBlockGetPayload<{
  include: typeof blockDetailInclude;
}>;

@Injectable()
export class FormPreliminaryLibraryDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browseQuestions(params: {
    companyId: string;
    category?: FormPreliminaryLibraryCategoryEnum;
    search?: string;
    skip: number;
    take: number;
  }) {
    const { questionOr } = await getFormCatalogAccessibleOrWhereParts(this.prisma, params.companyId);
    const where: Prisma.FormPreliminaryLibraryQuestionWhereInput = {
      AND: [
        { deleted_at: null, ...questionOr },
        ...(params.category ? [{ category: params.category }] : []),
        ...(params.search
          ? [
              {
                OR: [
                  { name: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
                  { question_text: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
                ],
              },
            ]
          : []),
      ],
    };

    const [data, count] = await this.prisma.$transaction([
      this.prisma.formPreliminaryLibraryQuestion.findMany({
        where,
        include: questionListInclude,
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.formPreliminaryLibraryQuestion.count({ where }),
    ]);

    return { data, count };
  }

  async readQuestionForCompany(companyId: string, questionId: string) {
    const { questionOr } = await getFormCatalogAccessibleOrWhereParts(this.prisma, companyId);
    return this.prisma.formPreliminaryLibraryQuestion.findFirst({
      where: {
        id: questionId,
        deleted_at: null,
        ...questionOr,
      },
      include: questionListInclude,
    });
  }

  async readQuestionCompanyScoped(companyId: string, questionId: string) {
    return this.prisma.formPreliminaryLibraryQuestion.findFirst({
      where: {
        id: questionId,
        company_id: companyId,
        deleted_at: null,
      },
      include: questionListInclude,
    });
  }

  async createQuestionWithOptions(
    data: {
      system: boolean;
      company_id: string | null;
      name: string;
      question_text: string;
      question_type: FormPreliminaryLibraryQuestionTypeEnum;
      category: FormPreliminaryLibraryCategoryEnum;
      identifier_type: FormIdentifierTypeEnum;
      accept_other: boolean;
      options: { text: string; order: number; value?: number | null }[];
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.formPreliminaryLibraryQuestion.create({
      data: {
        system: data.system,
        company_id: data.company_id,
        name: data.name,
        question_text: data.question_text,
        question_type: data.question_type,
        category: data.category,
        identifier_type: data.identifier_type,
        accept_other: data.accept_other,
        options: {
          create: data.options.map((o) => ({
            text: o.text,
            order: o.order,
            value: o.value ?? null,
          })),
        },
      },
      include: questionListInclude,
    });
  }

  async updateQuestionWithOptions(
    companyId: string,
    questionId: string,
    data: {
      name?: string;
      question_text?: string;
      question_type?: FormPreliminaryLibraryQuestionTypeEnum;
      category?: FormPreliminaryLibraryCategoryEnum;
      identifier_type?: FormIdentifierTypeEnum;
      accept_other?: boolean;
      options?: { text: string; order: number; value?: number | null }[];
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.formPreliminaryLibraryQuestion.findFirst({
        where: { id: questionId, company_id: companyId, system: false, deleted_at: null },
      });
      if (!existing) return null;

      if (data.options !== undefined) {
        const now = new Date();
        await tx.formPreliminaryLibraryQuestionOption.updateMany({
          where: { library_question_id: questionId, deleted_at: null },
          data: { deleted_at: now },
        });
        await tx.formPreliminaryLibraryQuestionOption.createMany({
          data: data.options.map((o) => ({
            library_question_id: questionId,
            text: o.text,
            order: o.order,
            value: o.value ?? null,
          })),
        });
      }

      return tx.formPreliminaryLibraryQuestion.update({
        where: { id: questionId },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.question_text !== undefined ? { question_text: data.question_text } : {}),
          ...(data.question_type !== undefined ? { question_type: data.question_type } : {}),
          ...(data.category !== undefined ? { category: data.category } : {}),
          ...(data.identifier_type !== undefined ? { identifier_type: data.identifier_type } : {}),
          ...(data.accept_other !== undefined ? { accept_other: data.accept_other } : {}),
        },
        include: questionListInclude,
      });
    });
  }

  /** Pergunta ainda vinculada a algum bloco da biblioteca que não foi excluído (soft delete). */
  async countActiveBlocksReferencingLibraryQuestion(libraryQuestionId: string): Promise<number> {
    return this.prisma.formPreliminaryLibraryBlockItem.count({
      where: {
        library_question_id: libraryQuestionId,
        block: { deleted_at: null },
      },
    });
  }

  async softDeleteQuestion(companyId: string, questionId: string) {
    const existing = await this.prisma.formPreliminaryLibraryQuestion.findFirst({
      where: { id: questionId, company_id: companyId, system: false, deleted_at: null },
    });
    if (!existing) return null;
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.formPreliminaryLibraryQuestionOption.updateMany({
        where: { library_question_id: questionId, deleted_at: null },
        data: { deleted_at: now },
      }),
      this.prisma.formPreliminaryLibraryQuestion.update({
        where: { id: questionId },
        data: { deleted_at: now },
      }),
    ]);
    return { id: questionId };
  }

  async browseBlocks(params: { companyId: string; search?: string; skip: number; take: number }) {
    const { blockOr } = await getFormCatalogAccessibleOrWhereParts(this.prisma, params.companyId);
    const where: Prisma.FormPreliminaryLibraryBlockWhereInput = {
      AND: [
        { deleted_at: null, ...blockOr },
        ...(params.search
          ? [
              {
                OR: [
                  { name: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
                  { description: { contains: params.search, mode: Prisma.QueryMode.insensitive } },
                ],
              },
            ]
          : []),
      ],
    };

    const [data, count] = await this.prisma.$transaction([
      this.prisma.formPreliminaryLibraryBlock.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.formPreliminaryLibraryBlock.count({ where }),
    ]);

    return { data, count };
  }

  async readBlockDetailForCompany(companyId: string, blockId: string) {
    const { blockOr } = await getFormCatalogAccessibleOrWhereParts(this.prisma, companyId);
    return this.prisma.formPreliminaryLibraryBlock.findFirst({
      where: {
        id: blockId,
        deleted_at: null,
        ...blockOr,
      },
      include: blockDetailInclude,
    });
  }

  async readBlockCompanyScoped(companyId: string, blockId: string) {
    return this.prisma.formPreliminaryLibraryBlock.findFirst({
      where: {
        id: blockId,
        company_id: companyId,
        deleted_at: null,
      },
      include: blockDetailInclude,
    });
  }

  async createBlockWithItems(
    data: {
      system: boolean;
      company_id: string | null;
      name: string;
      description?: string | null;
      items: { library_question_id: string; order: number }[];
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.formPreliminaryLibraryBlock.create({
      data: {
        system: data.system,
        company_id: data.company_id,
        name: data.name,
        description: data.description ?? null,
        items: {
          create: data.items.map((i) => ({
            library_question_id: i.library_question_id,
            order: i.order,
          })),
        },
      },
      include: blockDetailInclude,
    });
  }

  async updateBlockWithItems(
    companyId: string,
    blockId: string,
    data: {
      name?: string;
      description?: string | null;
      items?: { library_question_id: string; order: number }[];
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.formPreliminaryLibraryBlock.findFirst({
        where: { id: blockId, company_id: companyId, system: false, deleted_at: null },
      });
      if (!existing) return null;

      if (data.items) {
        await tx.formPreliminaryLibraryBlockItem.deleteMany({ where: { block_id: blockId } });
        await tx.formPreliminaryLibraryBlockItem.createMany({
          data: data.items.map((i) => ({
            block_id: blockId,
            library_question_id: i.library_question_id,
            order: i.order,
          })),
        });
      }

      return tx.formPreliminaryLibraryBlock.update({
        where: { id: blockId },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
        },
        include: blockDetailInclude,
      });
    });
  }

  async softDeleteBlock(companyId: string, blockId: string) {
    const existing = await this.prisma.formPreliminaryLibraryBlock.findFirst({
      where: { id: blockId, company_id: companyId, system: false, deleted_at: null },
    });
    if (!existing) return null;
    const now = new Date();
    await this.prisma.formPreliminaryLibraryBlock.update({
      where: { id: blockId },
      data: { deleted_at: now },
    });
    return { id: blockId };
  }

  /** Valida que todas as perguntas existem e são acessíveis (mesma regra que Form / browse). */
  async assertQuestionsAccessibleForBlock(companyId: string, questionIds: string[]) {
    const unique = [...new Set(questionIds)];
    const { questionOr } = await getFormCatalogAccessibleOrWhereParts(this.prisma, companyId);
    const found = await this.prisma.formPreliminaryLibraryQuestion.findMany({
      where: {
        id: { in: unique },
        deleted_at: null,
        ...questionOr,
      },
      select: { id: true },
    });
    if (found.length !== unique.length) {
      throw new BadRequestException('Uma ou mais perguntas não foram encontradas ou não estão acessíveis.');
    }
  }
}
