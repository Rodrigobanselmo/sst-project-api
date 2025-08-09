import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IFormParticipantsAnswersRepository } from './form-participants-answers.repository.types';

@Injectable()
export class FormParticipantsAnswersRepository {
  constructor(private readonly prisma: PrismaServiceV2) {}

  // async create(params: IFormParticipantsAnswersRepository.CreateParams) {
  //   await this.prisma.$transaction(async (tx) => {
  //     const participantsAnswers = await tx.formParticipantsAnswers.create({
  //       data: {
  //         form_application_id: params.application.id,
  //         employee_id: undefined,
  //       },
  //     });

  //     await Promise.all(
  //       params.answers.map(async (answer) => {
  //         return await tx.formAnswer.create({
  //           data: {
  //             question_id: answer.questionId,
  //             value: answer.value,
  //             option_id: answer.optionId,
  //             participants_answers_id: participantsAnswers.id,
  //           },
  //         });
  //       }),
  //     );
  //   });
  // }
}
