import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { gerWhereRawPrisma } from '@/@v2/shared/utils/database/get-where-raw-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FormQuestionsAnswersBrowseResultModelMapper, IFormQuestionsAnswersBrowseResultModelMapper } from '../../mappers/models/form-questions-answers/form-questions-answers-browse-result.mapper';
import { IFormQuestionsAnswersDAO } from './form-questions-answers.types';
import { FormQuestionsAnswersBrowseModel } from '@/@v2/forms/domain/models/form-questions-answers/form-questions-answers-browse.model';

@Injectable()
export class FormQuestionsAnswersDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async browse({ filters }: IFormQuestionsAnswersDAO.BrowseParams) {
    const form = await this.prisma.formApplication.findUnique({
      where: { id: filters.formApplicationId },
      select: { form_id: true },
    });

    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    const whereParams = this.browseWhere(filters, form.form_id);

    const queryResults = await this.prisma.$queryRaw<IFormQuestionsAnswersBrowseResultModelMapper[]>`
      SELECT 
        qg."id" as group_id,
        qg."form_application_id" as group_form_application_id,
        qgd."name" as group_name,
        qgd."description" as group_description,
        qgd."order" as group_order,
        q."id" as question_id,
        qd."required" as question_required,
        qd."order" as question_order,
        qdet."id" as question_details_id,
        qdetd."text" as question_details_text,
        qdetd."type" as question_details_type,
        qdetd."accept_other" as question_details_accept_other,
        qdet."system" as question_details_system,
        qdet."company_id" as question_details_company_id,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'option_id', qo."id",
              'option_text', qod."text",
              'option_value', qod."value",
              'option_order', qod."order"
            )
          ) FILTER (WHERE qo."id" IS NOT NULL), 
          '[]'::json
        ) as question_options,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'answer_id', fa."id",
              'answer_value', fa."value",
              'participants_answers_id', fa."participants_answers_id",
              'selected_options', COALESCE(
                (
                  SELECT JSON_AGG(fao."option_id")
                  FROM "FormAnswerOption" fao
                  WHERE fao."answer_id" = fa."id"
                ), '[]'::json
              )
            )
          ) FILTER (WHERE fa."id" IS NOT NULL),
          '[]'::json
        ) as answers
      FROM 
        "FormQuestionGroup" qg
        INNER JOIN "FormQuestionGroupData" qgd ON qg."id" = qgd."form_question_group_id" AND qgd."deleted_at" IS NULL
        INNER JOIN "FormQuestion" q ON qg."id" = q."question_group_id" AND q."deleted_at" IS NULL
        INNER JOIN "FormQuestionData" qd ON q."id" = qd."form_question_id" AND qd."deleted_at" IS NULL
        INNER JOIN "FormQuestionDetails" qdet ON q."question_details_id" = qdet."id" AND qdet."deleted_at" IS NULL
        INNER JOIN "FormQuestionDetailsData" qdetd ON qdet."id" = qdetd."form_question_details_id" AND qdetd."deleted_at" IS NULL
        LEFT JOIN "FormQuestionOption" qo ON qdet."id" = qo."question_id" AND qo."deleted_at" IS NULL
        LEFT JOIN "FormQuestionOptionData" qod ON qo."id" = qod."form_question_option_id" AND qod."deleted_at" IS NULL
        LEFT JOIN "FormAnswer" fa ON q."id" = fa."question_id" 
        LEFT JOIN "FormParticipantsAnswers" fpa ON fa."participants_answers_id" = fpa."id"
      ${gerWhereRawPrisma(whereParams)}
      GROUP BY 
        qg."id", qgd."name", qgd."description", qgd."order",
        q."id", qd."required", qd."order",
        qdet."id", qdetd."text", qdetd."type", qdetd."accept_other", qdet."system", qdet."company_id"
      ORDER BY qgd."order" ASC, qd."order" ASC;
    `;

    const results = FormQuestionsAnswersBrowseResultModelMapper.toModels(queryResults);

    return new FormQuestionsAnswersBrowseModel({ results });
  }

  private browseWhere(filters: IFormQuestionsAnswersDAO.BrowseParams['filters'], formId: string) {
    const where = [
      Prisma.sql`qgd."deleted_at" IS NULL`,
      Prisma.sql`qd."deleted_at" IS NULL`,
      Prisma.sql`qdetd."deleted_at" IS NULL`,
      Prisma.sql`(qod."deleted_at" IS NULL OR qod."deleted_at" IS NULL)`,
    ];

    if (filters.companyId) {
      where.push(Prisma.sql`qdet."company_id" = ${filters.companyId}`);
    }

    if (filters.formApplicationId) {
      where.push(Prisma.sql`
        (
          qg."form_application_id" = ${filters.formApplicationId}
          OR qg."form_id" = ${formId}
        ) 
        -- AND fpa."status" = 'VALID'
      `);
    }

    if (filters.search) {
      where.push(
        Prisma.sql`(
          qgd."name" ILIKE ${`%${filters.search}%`} OR 
          qdetd."text" ILIKE ${`%${filters.search}%`}
        )`,
      );
    }

    return where;
  }
}
