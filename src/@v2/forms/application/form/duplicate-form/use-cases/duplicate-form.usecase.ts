import { FormDAO } from '@/@v2/forms/database/dao/form/form.dao';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { generateCuid } from '@/@v2/shared/utils/helpers/generate-cuid';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IDuplicateFormUseCase } from './duplicate-form.types';

@Injectable()
export class DuplicateFormUseCase {
  constructor(
    private readonly formDAO: FormDAO,
    private readonly prisma: PrismaServiceV2,
  ) {}

  async execute(params: IDuplicateFormUseCase.Params): Promise<IDuplicateFormUseCase.Result> {
    const source = await this.formDAO.findForDuplication({
      id: params.sourceFormId,
      companyId: params.companyId,
    });

    if (!source) {
      throw new NotFoundException('Modelo de Formulário não encontrado');
    }

    const newFormId = generateCuid();

    await this.prisma.$transaction(
      async (tx) => {
        await tx.form.create({
          data: {
            id: newFormId,
            name: `${source.name} (cópia)`,
            description: source.description,
            type: source.type,
            anonymous: source.anonymous,
            shareable_link: source.shareable_link,
            system: false,
            company_id: params.companyId,
          },
        });

        const sortedGroups = [...source.questions_groups].sort(
          (a, b) => (a.data[0]?.order ?? 0) - (b.data[0]?.order ?? 0),
        );

        for (const group of sortedGroups) {
          const newGroupId = generateCuid();
          const groupData = group.data[0];

          await tx.formQuestionGroup.create({
            data: {
              id: newGroupId,
              form_id: newFormId,
            },
          });

          await tx.formQuestionGroupData.create({
            data: {
              name: groupData?.name ?? '',
              description: groupData?.description,
              order: groupData?.order ?? 0,
              form_question_group_id: newGroupId,
            },
          });

          const sortedQuestions = [...group.questions].sort(
            (a, b) => (a.data[0]?.order ?? 0) - (b.data[0]?.order ?? 0),
          );

          for (const question of sortedQuestions) {
            const newDetailsId = generateCuid();
            const newQuestionId = generateCuid();
            const qData = question.data[0];
            const detailsData = question.question_details.data[0];

            if (!detailsData) {
              throw new BadRequestException('Formulário de origem com estrutura de pergunta incompleta');
            }

            await tx.formQuestionDetails.create({
              data: {
                id: newDetailsId,
                system: false,
                company_id: params.companyId,
              },
            });

            await tx.formQuestionDetailsData.create({
              data: {
                text: detailsData.text,
                type: detailsData.type,
                accept_other: detailsData.accept_other,
                form_question_details_id: newDetailsId,
                question_copsoq_id: detailsData.question_copsoq_id,
                question_identifier_id: detailsData.question_identifier_id,
              },
            });

            await tx.formQuestion.create({
              data: {
                id: newQuestionId,
                question_details_id: newDetailsId,
                question_group_id: newGroupId,
              },
            });

            await tx.formQuestionData.create({
              data: {
                required: qData?.required ?? false,
                order: qData?.order ?? 0,
                form_question_id: newQuestionId,
              },
            });

            const sortedOptions = [...question.question_details.options].sort(
              (a, b) => (a.data[0]?.order ?? 0) - (b.data[0]?.order ?? 0),
            );

            for (const option of sortedOptions) {
              const newOptionId = generateCuid();
              const optionData = option.data[0];

              await tx.formQuestionOption.create({
                data: {
                  id: newOptionId,
                  question_id: newDetailsId,
                },
              });

              await tx.formQuestionOptionData.create({
                data: {
                  text: optionData?.text ?? '',
                  order: optionData?.order ?? 0,
                  value: optionData?.value ?? undefined,
                  form_question_option_id: newOptionId,
                },
              });
            }

            for (const risk of question.question_details.form_question_risk) {
              await tx.formQuestionRisk.create({
                data: {
                  question_Id: newDetailsId,
                  risk_id: risk.risk_id,
                },
              });
            }
          }
        }
      },
      { timeout: 60000 },
    );

    return { id: newFormId };
  }
}
