import { FormParticipantsAnswersEntity } from '@/@v2/forms/domain/entities/form-participants-answer.entity';
import { FormParticipantsAnswers as PrismaFormParticipantsAnswers } from '@prisma/client';

export type FormParticipantsAnswersEntityMapperConstructor = PrismaFormParticipantsAnswers;

export class FormParticipantsAnswersEntityMapper {
  static toEntity(prisma: FormParticipantsAnswersEntityMapperConstructor): FormParticipantsAnswersEntity {
    return new FormParticipantsAnswersEntity({
      id: prisma.id,
      employeeId: prisma.employee_id || undefined,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
    });
  }

  static toArray(prisma: FormParticipantsAnswersEntityMapperConstructor[]) {
    return prisma.map((p: FormParticipantsAnswersEntityMapperConstructor) => FormParticipantsAnswersEntityMapper.toEntity(p));
  }
}
